'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import NewHeader from "@/components/new-header";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import PlannerView from "@/components/ui/planner/PlannerView";

const supabase = createClient();

interface Note {
  id: number;
  title: string;
  note: string;
  date: string;
  created_at: string;
  user_id: string;
}

interface Task {
  id: number;
  title: string;
  task: string;
  date: string;
  done: boolean;
  created_at: string;
  user_id: string;
}

interface Event {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  created_at: string;
  user_id: string;
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  due_date?: string;
}

interface CalendarEntry {
  id: number;
  title: string;
  content: string;
  date: string;
  start_time: string;
  end_time: string;
  created_at: string;
  user_id: string;
}

export default function PlannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const userId = session.user.id;

      const [notesRes, tasksRes, eventsRes, goalsRes, calendarRes] = await Promise.all([
        supabase.from("notes").select("*").eq("user_id", userId).order("date", { ascending: false }),
        supabase.from("tasks").select("*").eq("user_id", userId).order("date", { ascending: false }),
        supabase.from("events").select("*").eq("user_id", userId).order("date", { ascending: false }),
        supabase.from("goals").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("calendar_entries").select("*").eq("user_id", userId).order("date", { ascending: false }),
      ]);

      if (notesRes.data) setNotes(notesRes.data);
      if (tasksRes.data) setTasks(tasksRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
      if (calendarRes.data) setCalendarEntries(calendarRes.data);

      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <NewHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <PlannerView
            notes={notes}
            tasks={tasks}
            events={events}
            goals={goals}
            calendarEntries={calendarEntries}
          />
        </main>
      </div>
    </div>
  );
}
