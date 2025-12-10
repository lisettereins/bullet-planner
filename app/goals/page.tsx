'use client';

import { useState, useEffect } from "react";
import { Plus, Target } from "lucide-react";
import NewHeader from "@/components/new-header";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import GoalItem from "@/components/ui/goals/GoalItem";
import GoalsHeader from "@/components/ui/goals/GoalsHeader";
import NewGoalForm from "@/components/ui/goals/NewGoalForm";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  due_date?: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalDueDate, setNewGoalDueDate] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData?.session?.user?.id ?? null;
      if (!mounted) return;

      setUserId(uid);
      if (uid) await fetchGoals(uid);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) fetchGoals(uid);
      else setGoals([]);
    });

    return () => {
      mounted = false;
      listener.subscription?.unsubscribe?.();
    };
  }, []);

  const fetchGoals = async (uid: string) => {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) return console.error(error);
    setGoals(data || []);
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !userId) return;

    const { data, error } = await supabase
      .from("goals")
      .insert({
        title: newGoalTitle,
        description: newGoalDescription,
        user_id: userId,
        completed: false,
        due_date: newGoalDueDate || null,
      })
      .select()
      .single();

    if (error) return console.error(error);
    setGoals([data, ...goals]);
    setNewGoalTitle("");
    setNewGoalDescription("");
    setNewGoalDueDate("");
    setShowNewGoal(false);
  };

  const handleToggleGoal = async (goal: Goal) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("goals")
      .update({ completed: !goal.completed })
      .eq("id", goal.id)
      .select()
      .single();

    if (error) return console.error(error);
    setGoals(goals.map(g => (g.id === goal.id ? data : g)));
  };

  const handleDeleteGoal = async (goalId: string) => {
    const { error } = await supabase.from("goals").delete().eq("id", goalId);
    if (error) return console.error(error);
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const completedCount = goals.filter(g => g.completed).length;
  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <NewHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 sm:p-8 py-12">

            {/* Page Header */}
            <GoalsHeader completedCount={completedCount} totalCount={goals.length} />

            {/* New Goal Button / Form */}
            <div className="mb-8">
              {!showNewGoal && (
                <button
                  onClick={() => setShowNewGoal(true)}
                  className="w-full sm:w-auto flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm font-semibold hover:bg-gray-900 transition-colors"
                >
                  <Plus className="w-5 h-5" strokeWidth={2} /> New Goal
                </button>
              )}
              {showNewGoal && (
                <NewGoalForm
                  title={newGoalTitle}
                  description={newGoalDescription}
                  dueDate={newGoalDueDate}
                  onTitleChange={setNewGoalTitle}
                  onDescriptionChange={setNewGoalDescription}
                  onDueDateChange={setNewGoalDueDate}
                  onAddGoal={handleAddGoal}
                  onCancel={() => setShowNewGoal(false)}
                />
              )}
            </div>

            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Active Goals</h2>
                <div className="space-y-4">
                  {activeGoals.map(goal => (
                    <GoalItem
                      key={goal.id}
                      goal={goal}
                      onToggle={handleToggleGoal}
                      onDelete={handleDeleteGoal}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Completed Goals</h2>
                <div className="space-y-4">
                  {completedGoals.map(goal => (
                    <GoalItem
                      key={goal.id}
                      goal={goal}
                      onToggle={handleToggleGoal}
                      onDelete={handleDeleteGoal}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {goals.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-sm">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-gray-600 mb-4">No goals yet. Time to dream big!</p>
                <button onClick={() => setShowNewGoal(true)} className="text-black font-semibold hover:underline">
                  Create your first goal
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
