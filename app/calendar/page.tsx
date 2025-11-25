"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import DashboardHeader from "@/components/ui/DashboardHeader";
import DashboardSidebar from "@/components/ui/DashboardSidebar";

import DayView from "@/components/ui/DayView";
import WeekView from "@/components/ui/WeekView";
import MonthView from "@/components/ui/MonthView";

type ViewMode = "day" | "week" | "month";

export default function CalendarPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  useEffect(() => {
    setUserEmail("user@example.com"); // placeholder for now
    setLoading(false);
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
      return selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    if (viewMode === "week") {
      return `Week of ${selectedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`;
    }

    return selectedDate.toLocaleDateString("en-US", {
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

          {/* ----------------- TOP BAR ----------------- */}
          <div className="flex items-center justify-between mb-6">

            {/* Left side — view mode buttons */}
            <div className="flex gap-2">
              {["day", "week", "month"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as ViewMode)}
                  className={`px-3 py-1 border rounded 
                    ${viewMode === mode ? "bg-black text-white" : "bg-white text-black"}
                  `}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            {/* Right side — arrows + title */}
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

          {/* ----------------- ACTIVE VIEW ----------------- */}
          {viewMode === "day" && <DayView selectedDate={selectedDate} />}
          {viewMode === "week" && <WeekView selectedDate={selectedDate} />}
          {viewMode === "month" && <MonthView selectedDate={selectedDate} />}

        </main>
      </div>
    </div>
  );
}
