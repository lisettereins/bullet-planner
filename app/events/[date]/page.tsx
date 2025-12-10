import DeleteEvent from '@/components/delete-event-btn';
import EventPage from '@/components/event-page';
import NewHeader from '@/components/new-header';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import { createClient } from '@/lib/supabase/server';
import { Calendar } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { date: string } }) {
  const { date } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: events } = await supabase
    .from('events')
    .select()
    .eq('date', date)
    .eq('user_id', user.id);

  const formatTime = (time: string) => {
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      return time.slice(0, 5); // "HH:MM"
    }
    return time; // fallback
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <NewHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center gap-3 ">
            <Calendar className="w-8 h-8" strokeWidth={2} />
            <h1 className="text-4xl font-bold">Events</h1>
          </div>
          <div className="max-w-4xl mx-auto mt-6">
            <EventPage selectedDate={date} />
            <div className="flex flex-1 flex-col gap-3">
              {events?.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-sm">
                  <p className="text-gray-600 mb-4">No events for this date</p>
                  <p className="text-black font-semibold">
                    Create your first event
                  </p>
                </div>
              ) : (
                events?.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 border rounded-sm flex items-start gap-3 bg-white"
                  >
                    <div className="flex flex-col flex-1">
                      <h3 className="font-semibold text-lg">
                        Event: {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm whitespace-pre-wrap">
                        Location: {event.location}
                      </p>
                      <p className="text-gray-600 text-sm whitespace-pre-wrap">
                        Time: {formatTime(event.time)}
                      </p>
                    </div>
                    <DeleteEvent eventId={event.id} />
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
