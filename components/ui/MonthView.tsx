import { WEEKDAYS, getDaysInMonth, getFirstDayOfMonth } from "@/utils/calendarHelpers";

export default function MonthView({ selectedDate }) {
  const daysInMonth = getDaysInMonth(selectedDate);
  const firstDay = getFirstDayOfMonth(selectedDate);

  const days = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {selectedDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </h2>

      <div className="grid grid-cols-7 gap-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center font-semibold text-sm p-2 text-gray-600">
            {d}
          </div>
        ))}

        {days.map((day, idx) =>
          day ? (
            <div key={idx} className="p-2 border rounded min-h-[80px] bg-white">
              <p className="font-semibold text-sm">{day.getDate()}</p>
            </div>
          ) : (
            <div key={idx}></div>
          )
        )}
      </div>
    </div>
  );
}
