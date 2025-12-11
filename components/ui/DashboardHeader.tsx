"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/supabaseClient";

interface DashboardHeaderProps {
  userEmail: string | null;
}

export default function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="border-b border-black/10 p-4 flex justify-between items-center">
      {/* LOGO VIIB DASHBOARDILE */}
      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
        <div className="border-2 border-black rounded-sm p-2">
          <BookOpen className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <span>Bullet Planner</span>
      </Link>

      {userEmail ? (
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
      ) : (
        <span className="text-sm text-gray-400">Not logged in</span>
      )}
    </header>
  );
}
