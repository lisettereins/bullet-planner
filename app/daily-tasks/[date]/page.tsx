import NewDatePicker from '@/components/new-datepicker';
import NewHeader from '@/components/new-header';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import AddTaskForm from '@/components/ui/tasks/AddTaskForm';
import TaskItem from '@/components/ui/tasks/TaskItem';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DailyTasksPage({
  params,
}: {
  params: { date: string };
}) {
  const { date } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: tasks } = await supabase
    .from('tasks')
    .select()
    .eq('date', date)
    .eq('user_id', user.id);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <NewHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <NewDatePicker selectedDate={date} param = "daily-tasks" />
            <AddTaskForm date={date} />
            <TaskItem tasks={tasks} />
          </div>
        </main>
      </div>
    </div>
  );
}
