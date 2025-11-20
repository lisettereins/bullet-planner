'use client';

import { useRouter } from 'next/navigation';
import TaskDatePicker from './ui/tasks/TaskDatePicker';

export default function NotePage({ selectedDate }: { selectedDate: string }) {
  const router = useRouter();

  const handleDateChange = (newDate: string) => {
    router.push(`/notes/${newDate}`);
  };

  return (
    <main>
      <div>
        <TaskDatePicker
          selectedDate={selectedDate}
          onChange={handleDateChange}
        />
      </div>
    </main>
  );
}
