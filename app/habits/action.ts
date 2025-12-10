'use server';

import { createClient } from '@/lib/supabase/server';

export async function createHabit(name: string, description?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('habits').insert({
    user_id: user.id,
    name: name,
    description: description || null,
  });

  if (error) throw error;
  return { success: true };
}

export async function habitDone(habitId: string, done: boolean, date: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('habit_logs')
    .insert({ habit_id: habitId, done, date });
  if (error) {
    throw new Error('toggle done failed');
  }
  return { success: true };
}

export async function deletehabit(habitId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .select();

  if (error) {
    throw new Error('delete failed');
  }
  return { success: true };
}
