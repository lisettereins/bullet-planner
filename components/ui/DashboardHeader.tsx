"use client";

import Link from "next/link";
import { BookOpen, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function DashboardHeader({ userEmail }: { userEmail: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="border-b border-black/10 p-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <div className="border-2 border-black rounded-sm p-2">
          <BookOpen className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <span>Bullet Planner</span>
      </Link>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{userEmail}</span>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" strokeWidth={2} />
          Logout
        </button>
      </div>
    </header>
  );
}
