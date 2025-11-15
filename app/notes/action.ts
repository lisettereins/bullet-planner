'use server'

import { createClient } from "@/lib/supabase/server";

export async function createNote(title: string, note: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notes")
    .insert({ title, note })
    .select();
    

  if (error) {
    throw new Error("create failed");
  }
  return { success: true };
}

