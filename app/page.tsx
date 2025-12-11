"use client";

import Link from "next/link";
// import { useState } from "react";
import { ArrowRight, BookOpen, Calendar, ListChecks, FileText, Image as ImageIcon } from "lucide-react";

export default function Page() {
  // const [isScrolled, setIsScrolled] = useState(false);

  // const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  //   const scrollY = e.currentTarget.scrollLeft;
  //   setIsScrolled(scrollY > 0);
  // };

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 border border-black rounded-full"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 border border-black rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-4xl text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="border-2 border-black rounded-sm p-6 inline-block">
              <BookOpen className="w-12 h-12 text-black" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Organize Your Life
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
            Your digital bullet planner. Keep all your thoughts, plans, and dreams in one elegant place.
          </p>

          {/* Features preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 text-sm text-gray-600">
            <div className="flex flex-col items-center gap-2">
              <ListChecks className="w-5 h-5 text-black" strokeWidth={1.5} />
              <span>Lists</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Calendar className="w-5 h-5 text-black" strokeWidth={1.5} />
              <span>Calendar</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-5 h-5 text-black" strokeWidth={1.5} />
              <span>Notes</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-5 h-5 text-black" strokeWidth={1.5} />
              <span>Photos</span>
            </div>
          </div>

          {/* Button */}
          <Link
            href="/login"
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-sm font-semibold text-lg hover:bg-gray-900 transition-colors group"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">Everything You Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards */}
            {[
              { icon: <ListChecks className="w-6 h-6 text-white" strokeWidth={1.5} />, title: "Daily Plans", desc: "Create and track your daily tasks and goals with ease." },
              { icon: <Calendar className="w-6 h-6 text-white" strokeWidth={1.5} />, title: "Calendar Views", desc: "See your schedule by day, week, or month. Stay on top of everything." },
              { icon: <FileText className="w-6 h-6 text-white" strokeWidth={1.5} />, title: "Notes & Entries", desc: "Capture your thoughts, ideas, and personal reflections." },
              { icon: <ImageIcon className="w-6 h-6 text-white" strokeWidth={1.5} />, title: "Visual Organization", desc: "Add images and customize your planner to match your style." },
              { icon: <BookOpen className="w-6 h-6 text-white" strokeWidth={1.5} />, title: "Personal Collections", desc: "Organize your life into custom collections and sections." },
              { icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: "Stay Organized", desc: "Keep your entire life in one place with beautiful simplicity." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 border border-black/20 rounded-sm hover:border-black transition-colors">
                <div className="mb-4 inline-block p-3 bg-black rounded-sm">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Get Organized?</h2>
          <p className="text-xl text-gray-300 mb-8">Join now and start building your perfect planner.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-sm font-semibold text-lg hover:bg-gray-100 transition-colors group"
          >
            Sign Up
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/10 py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>&copy; 2024 Bullet Planner. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
            <a href="#" className="hover:text-black transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
