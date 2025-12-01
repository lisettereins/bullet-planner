'use server';

import { createClient } from '@/lib/supabase/server';

export async function createNote(title: string, note: string, date: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Not authenticated');
  }

  const userId = user.id;

  const { error } = await supabase
    .from('notes')
    .insert({
      title,
      note,
      date,
      user_id: userId,
    })
    .select();

  if (error) {
    throw new Error('create failed');
  }
  return { success: true };
}

export async function deleteNote(noteId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .select();

  if (error) {
    throw new Error('delete failed');
  }
  return { success: true };
}
