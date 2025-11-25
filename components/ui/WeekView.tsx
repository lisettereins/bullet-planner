import { WEEKDAYS, getWeekDates } from "@/utils/calendarHelpers";

interface WeekViewProps {
  selectedDate: Date;
}

export default function WeekView({ selectedDate }: WeekViewProps) {
  const days = getWeekDates(selectedDate);
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center font-semibold text-sm p-2 text-gray-600"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`p-2 border rounded min-h-[120px] bg-white ${
              day.toISOString().split("T")[0] === todayStr
                ? "border-black border-2"
                : "border-gray-200"
            }`}
          >
            <p className="font-semibold text-sm">{day.getDate()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
