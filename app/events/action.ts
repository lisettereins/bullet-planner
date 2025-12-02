'use server';

import { createClient } from '@/lib/supabase/server';

export async function createEvent(
  title: string,
  location: string,
  date: string,
  time: string
) {
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
    .from('events')
    .insert({
      title,
      location,
      date,
      time,
      user_id: userId,
    })
    .select();

  if (error) {
    throw new Error('create failed');
  }
  return { success: true };
}
