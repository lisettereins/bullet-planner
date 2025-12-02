'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function WelcomeUser() {
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

  return (
    <h1 className="text-2xl font-bold">
      Welcome, {userEmail ? userEmail : 'User'}!
    </h1>
  );
}
