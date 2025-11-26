export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime?: string;  // "HH:mm"
}
