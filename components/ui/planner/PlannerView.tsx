'use client';

import { useState } from "react";
import { BookOpen, ListChecks, Calendar, FileText } from "lucide-react";

interface Note { id: number; title: string; note: string; date: string; created_at: string; user_id: string; }
interface Task { id: number; title: string; task: string; date: string; done: boolean; created_at: string; user_id: string; }
interface Event { id: number; title: string; location: string; date: string; time: string; created_at: string; user_id: string; }
interface Goal { id: string; title: string; description?: string; completed: boolean; user_id: string; created_at: string; due_date?: string; }
interface CalendarEntry { id: number; title: string; content: string; date: string; start_time: string; end_time: string; created_at: string; user_id: string; }

interface PlannerViewProps {
  notes: Note[];
  tasks: Task[];
  events: Event[];
  goals: Goal[];
  calendarEntries: CalendarEntry[];
}

export default function PlannerView({ notes, tasks, events, goals, calendarEntries }: PlannerViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = selectedDate.toISOString().split("T")[0];

  const leftEntries = {
    notes: notes.filter(n => n.date === formattedDate),
    tasks: tasks.filter(t => t.date === formattedDate),
  };

  const rightEntries = {
    events: events.filter(e => e.date === formattedDate),
    calendar: calendarEntries.filter(c => c.date === formattedDate),
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "task": return <ListChecks className="w-4 h-4" />;
      case "event": return <Calendar className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header (logo ja pealkiri nagu navis) */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5" strokeWidth={2} />
        <span className="text-2xl font-bold">My Planner</span>
      </div>

      {/* Date selector */}
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium mb-2">Select Date</label>
        <input
          type="date"
          id="date"
          value={formattedDate}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="px-3 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black"
        />
      </div>

      {/* Book view */}
      <div className="flex border border-black rounded-lg overflow-hidden shadow-lg">
        {/* Left page */}
        <div className="w-1/2 border-r border-black p-6 min-h-[400px]">
          <h2 className="text-xl font-semibold mb-4">Notes & Tasks</h2>

          {leftEntries.notes.length === 0 ? (
            <p className="text-sm text-gray-500">No notes</p>
          ) : leftEntries.notes.map(note => (
            <div key={note.id} className="p-2 mb-2 border-b flex items-center gap-2">
              {getTypeIcon("note")}
              <span>{note.title}</span>
            </div>
          ))}

          {leftEntries.tasks.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">No tasks</p>
          ) : leftEntries.tasks.map(task => (
            <div key={task.id} className="p-2 mb-2 border-b flex items-center gap-2">
              {getTypeIcon("task")}
              <span>{task.title}</span>
            </div>
          ))}
        </div>

        {/* Right page */}
        <div className="w-1/2 p-6 min-h-[400px]">
          <h2 className="text-xl font-semibold mb-4">Events & Calendar</h2>

          {rightEntries.events.length === 0 ? (
            <p className="text-sm text-gray-500">No events</p>
          ) : rightEntries.events.map(evt => (
            <div key={evt.id} className="p-2 mb-2 border-b flex items-center gap-2">
              {getTypeIcon("event")}
              <span>{evt.title} @ {evt.location} ({evt.time})</span>
            </div>
          ))}

          {rightEntries.calendar.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">No calendar entries</p>
          ) : rightEntries.calendar.map(entry => (
            <div key={entry.id} className="p-2 mb-2 border-b flex items-center gap-2">
              {getTypeIcon("calendar")}
              <span>{entry.title} ({entry.start_time} - {entry.end_time})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Goals (full width) */}
      <div className="border p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">Goals</h2>
        {goals.length === 0 ? (
          <p className="text-sm text-gray-500">No goals</p>
        ) : goals.map(goal => (
          <div key={goal.id} className="p-2 border-b flex justify-between">
            <span>{goal.title}</span>
            <span>{goal.completed ? "✔" : "⏳"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
