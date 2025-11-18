import { WEEKDAYS, getWeekDates } from "@/utils/calendarHelpers";

export default function WeekView({ selectedDate }) {
  const days = getWeekDates(selectedDate);

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

        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="p-2 border rounded min-h-[120px] bg-gray-50"
          >
            <p className="font-semibold text-sm">{day.getDate()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
