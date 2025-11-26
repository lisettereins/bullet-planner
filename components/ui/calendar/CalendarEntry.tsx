"use client";

import { Trash2, Clock } from "lucide-react";

export interface CalendarEntryProps {
  id: string;
  title: string;
  content?: string;
  startTime: string;
  endTime: string;
  onDelete: (id: string) => void;
}

export default function CalendarEntry({
  id,
  title,
  content,
  startTime,
  endTime,
  onDelete,
}: CalendarEntryProps) {
  return (
    <div
      className="absolute left-0 right-0 rounded-sm bg-purple-300 p-2 border-t-2 border-black overflow-hidden break-words"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-1 text-sm font-medium text-black">
            <Clock className="w-4 h-4" strokeWidth={2} />
            {startTime} - {endTime}
          </div>
          <h3 className="font-semibold text-black">{title}</h3>
          {content && <p className="text-black text-sm">{content}</p>}
        </div>

        <button
          onClick={() => onDelete(id)}
          className="p-1 hover:bg-red-100 rounded-sm text-red-600"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
