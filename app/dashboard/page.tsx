"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  LogOut,
  Calendar,
  ListChecks,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import { supabase } from "@/lib/supabase/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/"); 
      } else {
        setUserEmail(data.session.user.email);
      }

      setLoading(false);
    };

    fetchSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/"); 
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      
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
      <div className="flex flex-1">
        <aside className="border-r border-black/10 w-64 p-6">
          <nav className="space-y-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" strokeWidth={2} /> Calendar
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/daily-tasks" className="hover:text-gray-600 block">
                  Daily Tasks
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-gray-600 block">
                  Notes
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-gray-600 block">
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/planner"
                  className="hover:text-gray-600 block font-semibold"
                >
                  📖 My Planner
                </Link>
              </li>
            </ul>

            <h3 className="font-semibold mt-6 mb-2">Settings</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/profile"
                  className="hover:text-gray-600 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" strokeWidth={2} /> Account Settings
                </Link>
              </li>
            </ul>

            <h3 className="font-semibold mt-6 mb-2">Quick Actions</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="hover:text-gray-600 flex items-center gap-2 w-full text-left">
                  <ImageIcon className="w-4 h-4" strokeWidth={2} /> Add Photo
                </button>
              </li>
              <li>
                <button className="hover:text-gray-600 flex items-center gap-2 w-full text-left">
                  <ListChecks className="w-4 h-4" strokeWidth={2} /> New List
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold">Welcome, {userEmail}</h1>
          <p className="mt-2 text-gray-600">
            Your dashboard content goes here.
          </p>
        </main>
      </div>
    </div>
  );
}
