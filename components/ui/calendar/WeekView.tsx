import React, { useState, useEffect } from "react";

interface CalendarEntry {
  id: string;
  title: string;
  content?: string;
  date: string;
  time: string; // "HH:MM"
}

interface WeekViewProps {
  selectedDate: Date;
}

export default function WeekView({ selectedDate }: WeekViewProps) {
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newHour, setNewHour] = useState("06");

  // Laadi kõik eventid localStorage'ist
  useEffect(() => {
    const saved = localStorage.getItem("entries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const saveEntries = (updated: CalendarEntry[]) => {
    setEntries(updated);
    localStorage.setItem("entries", JSON.stringify(updated));
  };

  const addEntry = (date: string, hour: string) => {
    if (!newTitle) return;
    const newEntry: CalendarEntry = {
      id: Date.now().toString(),
      title: newTitle,
      date,
      time: hour + ":00",
    };
    saveEntries([...entries, newEntry]);
    setNewTitle("");
  };

  // Leia nädala algus (pühapäev)
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: 19 }, (_, i) => i + 6); // 06-24

  return (
    <div className="flex gap-2 overflow-x-auto">
      {days.map((day) => {
        const dateStr = day.toISOString().split("T")[0];
        return (
          <div key={dateStr} className="min-w-[180px]">
            <h3 className="text-center font-semibold mb-2">
              {day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </h3>
            <div className="space-y-1">
              {hours.map((h) => {
                const hourStr = h.toString().padStart(2, "0");
                const hourEntries = entries
                  .filter((e) => e.date === dateStr && e.time.startsWith(hourStr))
                  .sort((a, b) => a.time.localeCompare(b.time));
                return (
                  <div key={h} className="border p-1 rounded min-h-[40px] relative">
                    <span className="font-semibold text-xs">{hourStr}:00</span>
                    {hourEntries.map((e) => (
                      <div key={e.id} className="bg-purple-100 text-purple-800 rounded p-1 mt-1 text-xs truncate">
                        {e.title}
                      </div>
                    ))}
                    <div className="absolute top-1 right-1">
                      <input
                        type="text"
                        placeholder="Add"
                        value={newHour === hourStr ? newTitle : ""}
                        onChange={(e) => {
                          setNewHour(hourStr);
                          setNewTitle(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addEntry(dateStr, hourStr);
                        }}
                        className="border px-1 py-0.5 rounded text-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
