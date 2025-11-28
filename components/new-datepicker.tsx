'use client';

import { useRouter } from 'next/navigation';

export default function NewDatePicker({
  selectedDate,
}: {
  selectedDate: string;
}) {
  const router = useRouter();

  const handleDateChange = (newDate: string) => {
    router.push(`/dashboard/${newDate}`);
  };
  return (
    <div className="mb-6">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => handleDateChange(e.target.value)}
        className="px-3 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black"
      />
    </div>
  );
}
