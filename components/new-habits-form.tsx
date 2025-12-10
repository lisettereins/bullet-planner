'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { createHabit } from '@/app/habits/action';
import { useRouter } from 'next/navigation';

export default function NewHabitsForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHabit(name, description);
    setDescription('');
    setName('');
    router.refresh()
  };

  if (!showForm)
    return (
      <button
        onClick={() => setShowForm(true)}
        className="mb-6 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors"
      >
        <Plus className="w-5 h-5" strokeWidth={2} />
        Add Habit
      </button>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 border-2 border-black rounded-sm bg-gray-50"
    >
      <input
        type="text"
        placeholder="Habit"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full mb-2 px-3 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black"
      />
      <input
        type="text"
        placeholder="Desription (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-2 px-3 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black resize-none"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-black text-white py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors"
        >
          Add Habit
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
