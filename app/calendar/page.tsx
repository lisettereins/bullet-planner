"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import DashboardHeader from "@/components/ui/DashboardHeader";
import DashboardSidebar from "@/components/ui/DashboardSidebar";

import DayView from "@/components/ui/calendar/DayView";
import WeekView from "@/components/ui/calendar/WeekView";
import MonthView from "@/components/ui/calendar/MonthView";


type ViewMode = "day" | "week" | "month";

export default function CalendarPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const supabase = createClient()

  // Lae Supabase sessioon ja email
  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.push("/login");
        return;
      }
      setUserEmail(data.session.user.email);
      setLoading(false);
    };
    fetchSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  const handlePrev = () => {
    const d = new Date(selectedDate);
    if (viewMode === "month") d.setMonth(d.getMonth() - 1);
    if (viewMode === "week") d.setDate(d.getDate() - 7);
    if (viewMode === "day") d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };

  const handleNext = () => {
    const d = new Date(selectedDate);
    if (viewMode === "month") d.setMonth(d.getMonth() + 1);
    if (viewMode === "week") d.setDate(d.getDate() + 7);
    if (viewMode === "day") d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  const formatTitle = () => {
    if (viewMode === "day") {
      return selectedDate.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    if (viewMode === "week") {
      const start = new Date(selectedDate);
      const dayOfWeek = start.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // esmaspäev
      start.setDate(start.getDate() + diff);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const formatDDMM = (d: Date) =>
        `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;

      return `Week of ${formatDDMM(start)} - ${formatDDMM(end)}`;
    }

    return selectedDate.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <DashboardHeader title="Calendar" userEmail={userEmail!} />

      <div className="flex flex-1">
        <DashboardSidebar active="calendar" />

        <main className="flex-1 p-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {["day", "week", "month"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as ViewMode)}
                  className={`px-3 py-1 border rounded ${
                    viewMode === mode
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                className="px-3 py-1 border rounded bg-white"
              >
                ←
              </button>

              <h2 className="text-2xl font-bold text-center min-w-[220px]">
                {formatTitle()}
              </h2>

              <button
                onClick={handleNext}
                className="px-3 py-1 border rounded bg-white"
              >
                →
              </button>
            </div>
          </div>

          {/* Active view */}
          {viewMode === "day" && (
            <DayView selectedDate={selectedDate.toISOString().split("T")[0]} />
          )}
          {viewMode === "week" && <WeekView selectedDate={selectedDate} />}
          {viewMode === "month" && <MonthView selectedDate={selectedDate} />}
        </main>
      </div>
    </div>
  );
}
