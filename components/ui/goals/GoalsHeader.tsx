'use client';

import { Target } from 'lucide-react';

interface GoalsHeaderProps {
  completedCount: number;
  totalCount: number;
}

export default function GoalsHeader({ completedCount, totalCount }: GoalsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <Target className="w-8 h-8" strokeWidth={2} />
        <h1 className="text-4xl font-bold">Goals</h1>
      </div>
      <p className="text-gray-600">
        Track your goals. {completedCount} of {totalCount} completed.
      </p>
    </div>
  );
}
