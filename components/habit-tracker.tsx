'use client';

import { habitDone } from '@/app/habits/action';
import { CheckCircle2, Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Habit = {
  id: string;
  name: string;
  description: string;
};

type HabitLog = {
  id: string;
  date: string;
  done: boolean;
  habit_id: string;
};

interface HabitItemProps {
  habits: Habit[] | null;
  habit_logs: HabitLog[] | null;
}

export default function HabitTracker({ habits, habit_logs }: HabitItemProps) {

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const router = useRouter();

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const handleToggle = async (
    e: React.FormEvent,
    habit: Habit,
    date: string,
    done: boolean
  ) => {
    e.preventDefault();
    const newDone = !done;
    await habitDone(habit.id, newDone, date);
    router.refresh();
  };

  return (
    <table className=" border p-4 rounded-sm shadow table-auto">
      <thead>
        <tr>
          <th className="relative border rounded-sm bg-gray-50">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="absolute bottom-1 left-1 text-xs font-semibold">
                Habits
              </span>
              <span className="absolute top-1 right-1 text-xs font-semibold">
                Days
              </span>
            </div>
          </th>
          {daysOfWeek.map((day) => (
            <th
              key={day}
              className="p-4 border rounded-sm bg-gray-50 text-s"
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {habits?.map((habit) => (
          <tr key={habit.id}>
            <td className="border rounded-sm px-3 py-2 bg-gray-50 font-medium text-lg whitespace-nowrap">
              {habit.name}
            </td>
            {week.map((day) => {
              const log = habit_logs?.find(
                (l) => l.habit_id === habit.id && l.date === day
              );

              const done = log?.done === true;

              return (
                <td
                  key={habit.id + day}
                  className={`border rounded-sm h-10 p-0 text-center ${
              done ? 'opacity-60 bg-gray-50' : 'bg-white'
            }`}
                  
                >
                  <button
                    className="w-full h-full flex items-center justify-center text-lg"
                    onClick={(e) => handleToggle(e, habit, day, done)}
                  >
                    {done ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
