'use client';

import { taskDone } from '@/app/daily-tasks/action';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Task = {
  id: string;
  title: string;
  task: string;
  date: string;
  done: boolean;
};

interface TaskItemProps {
  tasks: Task[] | null;
}

export default function TaskItem({ tasks }: TaskItemProps) {
  const router = useRouter();

  const handleToggle = async (e: React.FormEvent, task: Task) => {
    e.preventDefault();
    const setDone = !task.done;
    await taskDone(task.id, setDone);
    router.refresh();
  };

  return (
    <div className="space-y-3">
      {!tasks || tasks.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-sm">
          <p className="text-gray-600 mb-4">No tasks for this date</p>
        </div>
      ) : (
        tasks?.map((task) => (
          <div
            key={task.id}
            className={`p-4 border rounded-sm flex items-start gap-3 transition-opacity ${
              task?.done ? 'opacity-60 bg-gray-50' : 'bg-white'
            }`}
          >
            <button
              onClick={(e) => handleToggle(e, task)}
              className="flex-shrink-0 mt-1 text-black hover:text-gray-700 transition-colors"
            >
              {task?.done ? (
                <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
              ) : (
                <Circle className="w-5 h-5" strokeWidth={2} />
              )}
            </button>

            <div className="flex-1">
              <h3
                className={`font-semibold text-lg ${
                  task?.done ? 'line-through text-gray-500' : ''
                }`}
              >
                {task?.title}
              </h3>
              {task?.task && (
                <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">
                  {task?.task}
                </p>
              )}
            </div>

            <button
              // onClick={() => onDelete(task.id)}
              className="flex-shrink-0 p-2 hover:bg-red-100 rounded-sm transition-colors text-red-600"
            >
              <Trash2 className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
