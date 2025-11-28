'use client';

import { supabase } from '@/lib/supabase/supabaseClient';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function WelcomeUser() {
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.push('/login');
      else setUserEmail(data.session.user.email);
    };
    fetchSession();
  }, [router]);

  return (
    <h1 className="text-2xl font-bold">
      Welcome, {userEmail ? userEmail : 'User'}!
    </h1>
  );
}
