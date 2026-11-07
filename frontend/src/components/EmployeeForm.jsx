
function EmployeeForm({
  showModal,
  formData,
  editId,
  saving,
  error,
  departments = [],
  onChange,
  onSubmit,
  onClose,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl sm:p-7">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              {editId ? "Edit Employee" : "Add Employee"}
            </h2>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Enter employee information below.
            </p>
          </div>

          <button type="button" onClick={onClose}
            className="rounded-lg bg-slate-100 px-3 py-2 text-slate-500 hover:bg-slate-200">
            ✕
          </button>
        </div>

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
                value={formData.name || ""}
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
                value={formData.email || ""}
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
                value={formData.phone || ""}
                onChange={onChange}
                required
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
              />
            </div>

            {/* Department dropdown */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Department
              </label>
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
            </div>

            {/* Designation */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation || ""}
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
                value={formData.joining_date || ""}
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
                value={formData.salary || ""}
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
                value={formData.status || "Active"}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

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
              className="w-full rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Saving..." : editId ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
