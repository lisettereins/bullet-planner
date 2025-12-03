"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createTask } from "@/app/daily-tasks/action";
import { useRouter } from "next/navigation";



export default function AddTaskForm({ date: initialDate }: { date: string }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [task, setTask] = useState("");

  const date = initialDate;

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTask(title, task, date);
    setTitle("");
    setTask("");
    setShowForm(false);
    router.refresh()
  };

  if (!showForm)
    return (
      <button
        onClick={() => setShowForm(true)}
        className="mb-6 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors"
      >
        <Plus className="w-5 h-5" strokeWidth={2} />
        Add Task
      </button>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 border-2 border-black rounded-sm bg-gray-50"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full mb-2 px-3 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black"
        autoFocus
      />
      <textarea
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Additional details (optional)"
        rows={3}
        className="w-full mb-2 px-3 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black resize-none"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-black text-white py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="flex-1 bg-white border-2 border-black text-black py-2 rounded-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
