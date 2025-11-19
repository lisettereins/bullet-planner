"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface Props {
  onAdd: (title: string, content: string) => void;
}

export default function AddTaskForm({ onAdd }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(title, content);
    setTitle("");
    setContent("");
    setShowForm(false);
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
        value={content}
        onChange={(e) => setContent(e.target.value)}
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
