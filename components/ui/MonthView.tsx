import { WEEKDAYS, getDaysInMonth, getFirstDayOfMonth } from "@/utils/calendarHelpers";

interface MonthViewProps {
  selectedDate: Date;
}

export default function MonthView({ selectedDate }: MonthViewProps) {
  const daysInMonth = getDaysInMonth(selectedDate);
  const firstDay = getFirstDayOfMonth(selectedDate);

  // Täida esimesed tühjad päevad
  const days: (Date | null)[] = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center font-semibold text-sm p-2 text-gray-600">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) =>
          day ? (
            <div
              key={day.toISOString()}
              className={`p-2 border rounded min-h-[80px] bg-white ${
                day.toISOString().split("T")[0] === todayStr
                  ? "border-black border-2"
                  : "border-gray-200"
              }`}
            >
              <p className="font-semibold text-sm">{day.getDate()}</p>
            </div>
          ) : (
            <div key={`empty-${idx}`} className="p-2 border-transparent min-h-[80px]"></div>
          )
        )}
      </div>
    </div>
  );
}
