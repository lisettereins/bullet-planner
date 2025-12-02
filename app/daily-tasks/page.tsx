"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import TaskDatePicker from "@/components/ui/tasks/TaskDatePicker";
import AddTaskForm from "@/components/ui/tasks/AddTaskForm";
import TaskList from "@/components/ui/tasks/TaskList";
import { Task } from "@/components/ui/tasks/types";
import { createClient } from "@/lib/supabase/client";

export default function DailyTasksPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const supabase = createClient()

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.push("/login");
      else setUserEmail(data.session.user.email);

      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      setLoading(false);
    };
    fetchSession();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleAddTask = (title: string, content: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      content,
      date: selectedDate,
      completed: false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const toggleTaskComplete = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  if (loading) return <div>Loading...</div>;

  const todayTasks = tasks.filter((task) => task.date === selectedDate);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <DashboardHeader title="Daily Tasks" userEmail={userEmail!} onLogout={handleLogout} />
      <div className="flex flex-1">
        <DashboardSidebar active="daily-tasks" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <TaskDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
            <AddTaskForm onAdd={handleAddTask} />
            <TaskList
              tasks={todayTasks}
              onToggle={toggleTaskComplete}
              onDelete={handleDeleteTask}
              onEmptyCreate={() => {}}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
