"use client";

import Link from "next/link";
import { Calendar, ListChecks, Image as ImageIcon, Settings } from "lucide-react";
import MiniCalendar from "@/components/ui/MiniCalendar";


export default function DashboardSidebar() {
  const today = new Date().toISOString().split("T")[0]
  return (
    <aside className="border-r border-black/10 w-64 p-6">
      <nav className="space-y-6">
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Calendar</h3>
          <MiniCalendar currentDate={new Date()} onSelectDate={(d) => console.log(d)} />
        </div>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/calendar" className="hover:text-gray-600 block">
              Calendar View
            </Link>
          </li>
          </ul>
        <ul className="space-y-2 text-sm">
          <li><Link href="/daily-tasks" className="hover:text-gray-600 block">Daily Tasks</Link></li>
          <li><Link href={`/notes/${today}`} className="hover:text-gray-600 block">Notes</Link></li>
          <li><Link href={`/events/${today}`} className="hover:text-gray-600 block">Events</Link></li>
          <li><Link href="/planner" className="hover:text-gray-600 block font-semibold">📖 My Planner</Link></li>
        </ul>

        <h3 className="font-semibold mt-6 mb-2">Settings</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/profile" className="hover:text-gray-600 flex items-center gap-2">
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
  );
}
