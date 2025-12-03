'use server';

import { createClient } from '@/lib/supabase/server';

export async function createTask(title: string, task: string, date: string) {
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
    .from('tasks')
    .insert({
      title,
      task,
      date,
      user_id: userId,
    })
    .select();

  if (error) {
    throw new Error('create failed');
  }
  return { success: true };
}

export async function taskDone(taskId: string, done: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('tasks')
    .update({ done })
    .eq('id', taskId);
  if (error) {
    throw new Error('toggle done failed');
  }
  return { success: true };
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .select();

  if (error) {
    throw new Error('delete failed');
  }
  return { success: true };
}