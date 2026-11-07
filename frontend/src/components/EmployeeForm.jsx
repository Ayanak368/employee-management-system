
function EmployeeForm({
  showModal,
  formData,
  editId,
  saving,
  error,
<<<<<<< HEAD
  departments = [],
=======
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
  onChange,
  onSubmit,
  onClose,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl sm:p-7">

        {/* Header */}
<<<<<<< HEAD
        <div className="mb-6 flex items-center justify-between">
=======
        <div className="mb-6 flex items-center justify-between gap-3">
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
          <div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              {editId ? "Edit Employee" : "Add Employee"}
            </h2>
<<<<<<< HEAD
=======

>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Enter employee information below.
            </p>
          </div>

<<<<<<< HEAD
          <button type="button" onClick={onClose}
            className="rounded-lg bg-slate-100 px-3 py-2 text-slate-500 hover:bg-slate-200">
=======
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-3 py-2 text-slate-500 transition hover:bg-slate-200"
          >
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
            ✕
          </button>
        </div>

<<<<<<< HEAD
=======
        {/* Form */}
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Employee Name
              </label>
              <input
                type="text"
                name="name"
<<<<<<< HEAD
                value={formData.name || ""}
=======
                value={formData.name}
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
                onChange={onChange}
                required
                placeholder="Enter employee name"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Email
              </label>
              <input
                type="email"
                name="email"
<<<<<<< HEAD
                value={formData.email || ""}
=======
                value={formData.email}
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
                onChange={onChange}
                required
                placeholder="Enter email address"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
<<<<<<< HEAD
                value={formData.phone || ""}
=======
                value={formData.phone}
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
                onChange={onChange}
                required
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
              />
            </div>

<<<<<<< HEAD
            {/* Department dropdown */}
=======
            {/* Department */}
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Department
              </label>
<<<<<<< HEAD
              <select
                name="department"
                value={formData.department || ""}
                onChange={onChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
=======
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={onChange}
                required
                placeholder="Enter department"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
              />
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
            </div>

            {/* Designation */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Designation
              </label>
              <input
                type="text"
                name="designation"
<<<<<<< HEAD
                value={formData.designation || ""}
=======
                value={formData.designation}
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
                onChange={onChange}
                required
                placeholder="Enter designation"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
              />
            </div>

            {/* Joining Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Joining Date
              </label>
              <input
                type="date"
                name="joining_date"
<<<<<<< HEAD
                value={formData.joining_date || ""}
=======
                value={formData.joining_date}
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
                onChange={onChange}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
              />
            </div>

            {/* Salary */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Salary
              </label>
              <input
                type="number"
                name="salary"
<<<<<<< HEAD
                value={formData.salary || ""}
=======
                value={formData.salary}
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
                onChange={onChange}
                required
                min="0"
                placeholder="Enter salary"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Status
              </label>
              <select
                name="status"
<<<<<<< HEAD
                value={formData.status || "Active"}
=======
                value={formData.status}
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
                onChange={onChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

<<<<<<< HEAD
=======
          {/* Error */}
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
<<<<<<< HEAD
              className="w-full rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Saving..." : editId ? "Update Employee" : "Add Employee"}
=======
              className="w-full rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving
                ? "Saving..."
                : editId
                  ? "Update Employee"
                  : "Add Employee"}
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
