
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import { createClient } from '@/lib/supabase/server';

export default async function Page({ params }: { params: { date: string } }) {
  const { date } = await params;
  const supabase = await createClient();

  const { data: notes } = await supabase
    .from('notes')
    .select()
    .eq('date', date);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            
            <div className="flex flex-1 flex-col gap-3">
              {notes?.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-sm">
                  <p className="text-gray-600 mb-4">No notes for this date</p>
                  <p className="text-black font-semibold">
                    Create your first note
                  </p>
                </div>
              ) : (
                notes?.map((note) => (
                  <div
                    key={note.id}
                    className="flex flex-col gap-1 p-2 border-b last:border-b-0"
                  >
                    <h3 className="font-semibold text-lg">
                      Event: {note.title}
                    </h3>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">
                      Location: {note.location}
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
