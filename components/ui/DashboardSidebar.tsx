"use client";

import Link from "next/link";
import { Calendar, ListChecks, Image as ImageIcon, Settings, CheckSquare, FileText, BookOpen, Target, Activity } from "lucide-react";
import MiniCalendar from "@/components/ui/MiniCalendar";

export default function DashboardSidebar() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <aside className="border-r border-black/10 w-64 p-6">
      <nav className="space-y-6">

        {/* Calendar */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Calendar</h3>
          <MiniCalendar currentDate={new Date()} onSelectDate={(d) => console.log(d)} />
          <ul className="space-y-2 text-sm mt-2">
            <li>
              <Link href="/calendar" className="hover:text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" strokeWidth={2} /> Calendar View
              </Link>
            </li>
          </ul>
        </div>

        {/* My Items */}
        <div>
          <h3 className="font-semibold mb-2">My Items</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/daily-tasks" className="hover:text-gray-600 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" strokeWidth={2} /> Daily Tasks
              </Link>
            </li>
            <li>
              <Link href={`/notes/${today}`} className="hover:text-gray-600 flex items-center gap-2">
                <FileText className="w-4 h-4" strokeWidth={2} /> Notes
              </Link>
            </li>
            <li>
              <Link href={`/events/${today}`} className="hover:text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" strokeWidth={2} /> Events
              </Link>
            </li>
            <li>
              <Link href="/planner" className="hover:text-gray-600 flex items-center gap-2">
                <BookOpen className="w-4 h-4" strokeWidth={2} /> My Planner
              </Link>
            </li>
            <li>
              <Link href="/goals" className="hover:text-gray-600 flex items-center gap-2">
                <Target className="w-4 h-4" strokeWidth={2} /> Goals
              </Link>
            </li>
            <li>
              <Link href="/habits" className="hover:text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" strokeWidth={2} /> Habits
              </Link>
            </li>
            <li>
              <Link href="/lists" className="hover:text-gray-600 flex items-center gap-2">
                <ListChecks className="w-4 h-4" strokeWidth={2} /> Lists
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-gray-600 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" strokeWidth={2} /> Photos
              </Link>
            </li>
          </ul>
        </div>

        {/* Settings */}
        <div>
          <h3 className="font-semibold mt-6 mb-2">Settings</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/profile" className="hover:text-gray-600 flex items-center gap-2">
                <Settings className="w-4 h-4" strokeWidth={2} /> My Account
              </Link>
            </li>
          </ul>
        </div>

      </nav>
    </aside>
  );
}
