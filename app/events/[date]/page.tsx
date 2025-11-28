import EventPage from '@/components/event-page';
import NewHeader from '@/components/new-header';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import { createClient } from '@/lib/supabase/server';

export default async function Page({ params }: { params: { date: string } }) {
  const { date } = await params;
  const supabase = await createClient();

  const { data: events } = await supabase
    .from('events')
    .select()
    .eq('date', date);

  const formatTime = (time: string) => {
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
    return time.slice(0, 5); // "HH:MM"
  }
  return time; // fallback
  };


  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <NewHeader/>
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
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
                    className="flex flex-col gap-1 p-2 border-b last:border-b-0"
                  >
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
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
