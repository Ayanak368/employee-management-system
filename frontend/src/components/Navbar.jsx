<<<<<<< HEAD

function Navbar({ onAddEmployee, onAddManager }) {
  return (
    <header className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-7">

=======
function Navbar({ onAddEmployee }) {
  return (
    <header className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-7">
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
      {/* Page Title */}
      <div>
        <p className="text-xs text-slate-400 sm:text-sm">
          Workspace / Dashboard
        </p>

        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
          Dashboard
        </h1>
      </div>

<<<<<<< HEAD
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">

        <button
          onClick={onAddManager}
          className="rounded-lg border border-violet-600 px-4 py-3 text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
        >
          + Add Manager
        </button>

        <button
          onClick={onAddEmployee}
          className="rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 sm:px-6"
        >
          + Add Employee
        </button>

      </div>
=======
      {/* Add Employee Button */}
      <button
        onClick={onAddEmployee}
        className="rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 sm:px-6"
      >
        + Add Employee
      </button>
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
    </header>
  );
}

<<<<<<< HEAD
export default Navbar;
=======
export default Navbar;
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
