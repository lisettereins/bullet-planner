"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import CalendarEntry from "./CalendarEntry";

interface CalendarEntryType {
  id: string;
  title: string;
  content?: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface DayViewProps {
  selectedDate: string; // YYYY-MM-DD
}

export default function DayView({ selectedDate }: DayViewProps) {
  const [entries, setEntries] = useState<CalendarEntryType[]>([]);

  const [formPosition, setFormPosition] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newStartTime, setNewStartTime] = useState("06:00");
  const [newEndTime, setNewEndTime] = useState("07:00");

  // ---- LOAD FROM SUPABASE ----
  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("calendar_entries")
        .select("*")
        .eq("date", selectedDate)
        .order("start_time", { ascending: true });

      if (!data || error) {
        setEntries([]);
        return;
      }

      setEntries(
        (data ?? []).map((d) => ({
          id: d.id.toString(),
          title: d.title,
          content: d.content,
          date: d.date,
          startTime: d.start_time,
          endTime: d.end_time,
        }))
      );
    };

    fetchEntries();
  }, [selectedDate]);

  // ---- SAVE NEW ENTRY ----
  const saveEntry = async (entry: CalendarEntryType) => {
    const { data, error } = await supabase
      .from("calendar_entries")
      .insert([
        {
          title: entry.title,
          content: entry.content,
          date: entry.date,
          start_time: entry.startTime,
          end_time: entry.endTime,
        },
      ])
      .select("*");

    if (!data || error) return null;

    return {
      id: data[0].id.toString(),
      ...entry,
    };
  };

  const handleAddEntry = async () => {
    if (!newTitle.trim()) return;

    const draftEntry: CalendarEntryType = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: newContent.trim(),
      date: selectedDate,
      startTime: newStartTime,
      endTime: newEndTime,
    };

    const saved = await saveEntry(draftEntry);
    if (!saved) return;

    setEntries([...entries, saved]);
    resetForm();
  };

  const resetForm = () => {
    setFormPosition(null);
    setNewTitle("");
    setNewContent("");
    setNewStartTime("06:00");
    setNewEndTime("07:00");
  };

  // ---- DELETE ----
  const handleDelete = async (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
    await supabase.from("calendar_entries").delete().eq("id", id);
  };

  const hours = Array.from({ length: 19 }, (_, i) => i + 6);

  const getTopPosition = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return (h - 6 + m / 60) * 50;
  };

  const handleHourClick = (h: number) => {
    const hourStr = h.toString().padStart(2, "0") + ":00";
    setNewStartTime(hourStr);
    setNewEndTime(hourStr);
    setFormPosition(getTopPosition(hourStr) + 2);
  };

  return (
    <div className="relative max-w-4xl mx-auto p-4 border">

      <h2 className="text-2xl font-bold mb-4">
        {new Date(selectedDate).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </h2>

      <div className="relative border-t border-gray-300" style={{ height: hours.length * 50 }}>

        {/* TIME ROWS */}
        {hours.map((h) => (
          <div
            key={h}
            className="absolute left-0 right-0 flex items-center cursor-pointer"
            style={{ top: (h - 6) * 50 }}
            onClick={() => handleHourClick(h)}
          >
            <span className="w-12 text-xs font-semibold">
              {h.toString().padStart(2, "0")}:00
            </span>
            <div className="flex-1 ml-2 border-t border-gray-300"></div>
          </div>
        ))}

        {/* EVENTS */}
        {entries.map((entry) => {
          const top = getTopPosition(entry.startTime) + 2;
          const bottom = getTopPosition(entry.endTime);
          const minHeight = Math.max(bottom - top, 28);

          return (
            <div
              key={entry.id}
              style={{ top, minHeight }}
              className="absolute left-12 right-2"
            >
              <CalendarEntry
                id={entry.id}
                title={entry.title}
                content={entry.content}
                startTime={entry.startTime}
                endTime={entry.endTime}
                onDelete={handleDelete}
              />
            </div>
          );
        })}

        {/* FORM */}
        {formPosition !== null && (
          <div
            className="absolute left-0 right-0 p-4 bg-gray-50 border-2 border-black rounded-sm"
            style={{ top: formPosition }}
          >
            <input
              type="text"
              autoFocus
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full mb-2 px-3 py-2 border border-black/20 rounded-sm"
            />

            <textarea
              placeholder="Content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full mb-2 px-3 py-2 border border-black/20 rounded-sm resize-none"
            />

            <div className="flex gap-2 mb-2">
              <input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="flex-1 px-3 py-2 border border-black/20 rounded-sm"
              />
              <input
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="flex-1 px-3 py-2 border border-black/20 rounded-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddEntry}
                className="flex-1 bg-black text-white py-2 rounded-sm font-semibold"
              >
                Add
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-white border-2 border-black text-black py-2 rounded-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
