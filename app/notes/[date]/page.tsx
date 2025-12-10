import DeleteNoteBtn from '@/components/delete-note-btn';
import NewHeader from '@/components/new-header';
import NotePage from '@/components/note-page';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import { createClient } from '@/lib/supabase/server';
import { FileText } from 'lucide-react';
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

  const { data: notes } = await supabase
    .from('notes')
    .select()
    .eq('date', date)
    .eq('user_id', user.id);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <NewHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center gap-3 ">
            <FileText className="w-8 h-8" strokeWidth={2} />
            <h1 className="text-4xl font-bold">Notes</h1>
          </div>
          <div className="max-w-4xl mx-auto mt-6">
            <NotePage selectedDate={date} />
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
                    className="p-4 border rounded-sm flex items-start gap-3 bg-white"
                  >
                    <div className="flex flex-col flex-1">
                      <h3 className="font-semibold text-lg">
                        Title: {note.title}
                      </h3>
                      <p className="text-gray-600 text-sm whitespace-pre-wrap">
                        Note: {note.note}
                      </p>
                    </div>
                    <DeleteNoteBtn noteId={note.id} />
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
