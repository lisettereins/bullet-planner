'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import NewNoteForm from './new-note-form';
import AddTaskForm from './ui/tasks/AddTaskForm';
import NewEventForm from './new-event-form';

export default function NewEntryForm({ date }: { date: string }) {
  const [showForm, setShowForm] = useState(false);

  if (!showForm)
    return (
      <button
        onClick={() => setShowForm(true)}
        className="mb-6 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors"
      >
        <Plus className="w-5 h-5" strokeWidth={2} />
        Add Entry
      </button>
    );
  return (
    <div className="mb-6 p-4 border-2 border-black rounded-sm bg-gray-50">
      <NewEventForm date={date} />
      <NewNoteForm date={date} />
      <AddTaskForm date={date} />
      <div>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="w-full bg-white border-2 border-black text-black py-2 rounded-sm font-semibold text-center hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
