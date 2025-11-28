import NewDatePicker from '@/components/new-datepicker';
import NewHeader from '@/components/new-header';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import WelcomeUser from '@/components/welcome-user';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage({
  params,
}: {
  params: { date: string };
}) {
  const { date } = await params;
  const supabase = await createClient();

  // format time to hh:mm
  const formatTime = (time: string) => {
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      return time.slice(0, 5);
    }
    return time;
  };

  const { data: events } = await supabase
    .from('events')
    .select()
    .eq('date', date);

  const { data: notes } = await supabase
    .from('notes')
    .select()
    .eq('date', date);

  const { data: tasks } = await supabase
    .from('tasks')
    .select()
    .eq('date', date);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <NewHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          {/* <h1>{date}</h1> */}
          <WelcomeUser />
          <p className="text-gray-600 text-sm">Select date:</p>
          <NewDatePicker selectedDate={date} />
          <div className="flex flex-1 gap-6">
            {/* Events */}
            <div className="flex-1 flex flex-col border p-4">
              <h1 className="font-semibold text-lg mb-2">Events</h1>
              <div className="flex flex-col gap-3">
                {events?.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-sm">
                    <p className="text-gray-600 mb-4">
                      No events for this date
                    </p>
                  </div>
                ) : (
                  events?.map((event) => (
                    <div
                      key={event.id}
                      className="flex flex-col gap-1 p-2 border-b last:border-b-0"
                    >
                      <h3 className="font-semibold text-lg">
                        Event: {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Location: {event.location}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Time: {formatTime(event.time)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="flex-1 flex flex-col border p-4">
              <h1 className="font-semibold text-lg mb-2">Notes</h1>
              <div className="flex flex-col gap-3">
                {notes?.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-sm">
                    <p className="text-gray-600 mb-4">No notes for this date</p>
                  </div>
                ) : (
                  notes?.map((note) => (
                    <div
                      key={note.id}
                      className="flex flex-col gap-1 p-2 border-b last:border-b-0"
                    >
                      <h3 className="font-semibold text-lg">
                        Title: {note.title}
                      </h3>
                      <p className="text-gray-600 text-sm">Note: {note.note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Tasks */}
            <div className="flex-1 flex flex-col border p-4">
              <h1 className="font-semibold text-lg mb-2">Tasks</h1>
              {tasks?.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-sm">
                  <p className="text-gray-600 mb-4">No tasks for this date</p>
                </div>
              ) : (
                tasks?.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col gap-1 p-2 border-b last:border-b-0"
                  >
                    <h3 className="font-semibold text-lg">
                      Title: {task.title}
                    </h3>
                    <p className="text-gray-600 text-sm">Task: {task.task}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
