'use client';

import { useState } from "react";
import { Plus } from "lucide-react";

interface NewListFormProps {
  onCreate: (name: string) => void;
  onCancel: () => void;
}

export default function NewListForm({ onCreate, onCancel }: NewListFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 border-2 border-black rounded-sm bg-gray-50">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="List name..."
        className="w-full mb-4 px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black text-lg font-semibold"
        autoFocus
        required
      />
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-black text-white py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors">
          <Plus className="w-5 h-5" strokeWidth={2} /> Create List
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-white border-2 border-black text-black py-2 rounded-sm font-semibold hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
