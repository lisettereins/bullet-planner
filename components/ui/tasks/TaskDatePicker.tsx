"use client";

interface Props {
  selectedDate: string;
  onChange: (value: string) => void;
}

export default function TaskDatePicker({ selectedDate, onChange }: Props) {
  return (
    <div className="mb-6">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black"
      />
    </div>
  );
}
