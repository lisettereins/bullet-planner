"use client";

import { deleteTask, taskDone } from '@/app/daily-tasks/action';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type Task = {
  id: string;
  title: string;
  task: string;
  date: string;
  done: boolean;
};

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div
      key={task.id}
      className={`p-4 border rounded-sm flex items-start gap-3 transition-opacity ${
        task.done ? 'opacity-60 bg-gray-50' : 'bg-white'
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 mt-1 text-black hover:text-gray-700 transition-colors"
      >
        {task.done ? (
          <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
        ) : (
          <Circle className="w-5 h-5" strokeWidth={2} />
        )}
      </button>

      <div className="flex-1">
        <h3
          className={`font-semibold text-lg ${
            task.done ? 'line-through text-gray-500' : ''
          }`}
        >
          {task.title}
        </h3>

        {task.task && (
          <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">
            {task.task}
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 p-2 hover:bg-red-100 rounded-sm transition-colors text-red-600"
      >
        <Trash2 className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  );
}
