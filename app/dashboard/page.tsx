// for redirecting /dashboard to /dashboard/date
import { redirect } from 'next/navigation';

export default function DashboardRedirect() {
  const today = new Date().toISOString().split('T')[0];
  redirect(`/dashboard/${today}`);
}
