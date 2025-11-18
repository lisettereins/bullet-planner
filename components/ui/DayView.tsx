export default function DayView({ selectedDate }) {
  return (
    <div className="p-4 border rounded min-h-[120px] bg-gray-50">
      <h2 className="text-2xl font-bold mb-2">{selectedDate.toDateString()}</h2>
    </div>
  );
}
