function StatCard({ title, value, icon, color }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5">

      {/* Card Header */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500 sm:text-sm">
          {title}
        </p>

        <div
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-base sm:h-10 sm:w-10 sm:text-lg ${color}`}
        >
          {icon}
        </div>
      </div>

      {/* Card Value */}
      <h3 className="mt-3 text-2xl font-bold text-slate-800 sm:mt-4 sm:text-3xl">
        {value}
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        Current records
      </p>
    </div>
  );
}

export default StatCard;