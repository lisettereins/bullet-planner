'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function NewHeader() {
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const router = useRouter();

  const supabase = createClient()

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.push('/login');
      else setUserEmail(data.session.user.email);
    };
    fetchSession();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); 
  };

  return (
    <header className="border-b border-black/10 p-4 flex justify-between items-center">
      <Link href="dashboard" className="flex items-center gap-2 font-bold text-lg">
        <div className="border-2 border-black rounded-sm p-2">
          <BookOpen className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <span>Bullet Planner</span>
      </Link>

      {userEmail && (
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
      )}
    </header>
  );
}
