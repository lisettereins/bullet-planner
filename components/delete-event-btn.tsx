'use client';

import { deleteEvent } from '@/app/events/action';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteEvent({ eventId }: { eventId: string }) {
  const router = useRouter();

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure?')) {
      return;
    }
    await deleteEvent(eventId);
    router.refresh();
  };

  return (
    <button
      onClick={() => handleDelete(eventId)}
      className="flex-shrink-0 p-2 hover:bg-red-100 rounded-sm transition-colors text-red-600"
    >
      <Trash2 className="w-5 h-5" strokeWidth={2} />
    </button>
  );
}
