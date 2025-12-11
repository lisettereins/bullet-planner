"use client";

import TaskItem from "./TaskItem";
import type { Task } from "./TaskItem"; // kasuta sama Task tüüpi

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEmptyCreate?: () => void;
}

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onEmptyCreate,
}: TaskListProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-sm">
        <p className="text-gray-600 mb-4">No tasks for this date</p>
        {onEmptyCreate && (
          <button
            onClick={() => onEmptyCreate()}
            className="text-black font-semibold hover:underline"
          >
            Create your first task
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
