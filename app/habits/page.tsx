import DeleteHabitBtn from '@/components/del-habit-btn';
import NewHabitsForm from '@/components/new-habits-form';
import NewHeader from '@/components/new-header';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import { createClient } from '@/lib/supabase/server';
import { Activity } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function name() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: habits } = await supabase
    .from('habits')
    .select()
    .eq('user_id', user.id);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black mb-8">
      <NewHeader />

      <div className="flex flex-1">
        <DashboardSidebar />

        <main className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8" strokeWidth={2} />
            <h1 className="text-4xl font-bold">Habits</h1>
          </div>

          <div className="max-w-4xl">
            <NewHabitsForm />
          </div>

          <div className="flex gap-6">
            <aside className="w-64 flex flex-col border-2 border-black rounded-sm bg-gray-20 p-4 overflow-y-auto">
              <h2 className="text-center font-semibold mb-2">Habit List</h2>

              {habits?.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-gray-600 text-sm">
                  No habits
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {habits?.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex justify-between items-center p-2 text-gray-600 text-sm border-b last:border-b-0"
                    >
                      <span>{habit.name}</span>
                      <DeleteHabitBtn habitId={habit.id} />
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
