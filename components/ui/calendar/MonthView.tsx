import React, { useState, useEffect } from "react";
import DayView from "./DayView"; // eeldame, et DayView on olemas

interface CalendarEntry {
  id: string;
  title: string;
  content?: string;
  date: string;
  time: string; // "HH:MM"
}

interface MonthViewProps {
  selectedDate: Date;
}

export default function MonthView({ selectedDate }: MonthViewProps) {
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [activeDay, setActiveDay] = useState<Date | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("entries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();

  const days: (Date | null)[] = [];

  // Täida tühjad päevad kuu alguses
  for (let i = 0; i < firstDayIndex; i++) days.push(null);

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));
  }

  if (activeDay) {
    return (
      <div>
        <button
          onClick={() => setActiveDay(null)}
          className="mb-4 px-3 py-1 border rounded"
        >
          Back to Month
        </button>
        <DayView selectedDate={activeDay} />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center font-semibold text-sm p-2 text-gray-600">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) =>
          day ? (
            <button
              key={idx}
              onClick={() => setActiveDay(day)}
              className="border rounded min-h-[80px] p-2 text-left hover:bg-gray-100 transition-colors"
            >
              <p className="font-semibold text-sm mb-1">{day.getDate()}</p>
              <div className="space-y-1 text-xs">
                {entries
                  .filter((e) => e.date === day.toISOString().split("T")[0])
                  .slice(0, 2)
                  .map((e) => (
                    <div
                      key={e.id}
                      className="bg-purple-100 text-purple-800 rounded p-1 truncate"
                    >
                      {e.title}
                    </div>
                  ))}
                {entries.filter((e) => e.date === day.toISOString().split("T")[0]).length > 2 && (
                  <p className="text-gray-500">+ more</p>
                )}
              </div>
            </button>
          ) : (
            <div key={idx} className="min-h-[80px]"></div>
          )
        )}
      </div>
    </div>
  );
}
