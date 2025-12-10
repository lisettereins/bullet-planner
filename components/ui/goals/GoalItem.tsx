'use client';

import { Check, Trash2 } from "lucide-react";

interface GoalItemProps {
  goal: {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    due_date?: string;
  };
  onToggle: (goal: any) => void;
  onDelete: (goalId: string) => void;
  formatDate: (dateStr: string) => string;
}

export default function GoalItem({ goal, onToggle, onDelete, formatDate }: GoalItemProps) {
  return (
    <div className={`p-6 border rounded-sm transition-colors flex items-start justify-between gap-4 ${goal.completed ? 'border-green-200 bg-green-50' : 'border-black/10 bg-white hover:border-black'}`}>
      <div className="flex items-start gap-4 flex-1">
        <button onClick={() => onToggle(goal)} className="mt-1 p-2 rounded-sm flex-shrink-0 hover:bg-gray-100 transition-colors">
          <div className={`w-6 h-6 border-2 border-black rounded-sm flex items-center justify-center ${goal.completed ? 'bg-black' : ''}`}>
            {goal.completed && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
          </div>
        </button>
        <div className="flex-1">
          <h3 className={`font-semibold text-lg mb-1 ${goal.completed ? 'line-through text-gray-600' : ''}`}>{goal.title}</h3>
          {goal.description && <p className={`text-gray-600 mb-2 ${goal.completed ? 'line-through text-gray-500' : ''}`}>{goal.description}</p>}
          {goal.due_date && <p className="text-xs text-gray-500">Due: {formatDate(goal.due_date)}</p>}
        </div>
      </div>
      <button onClick={() => onDelete(goal.id)} className="p-2 hover:bg-red-100 rounded-sm text-red-600 flex-shrink-0 transition-colors">
        <Trash2 className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  );
}
