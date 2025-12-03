// for redirecting /daily-tasks to /daily-tasks/date
import { redirect } from 'next/navigation';

export default function DailyTasksRedirect() {
  const today = new Date().toISOString().split('T')[0];
  redirect(`/daily-tasks/${today}`);
}
