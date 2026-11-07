
function EmployeeTable({
  employees,
  loading,
  role,
  search,
  setSearch,
  departments,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  onEdit,
  onDelete,
}) {
  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      emp.name.toLowerCase().includes(searchValue) ||
      emp.email.toLowerCase().includes(searchValue) ||
      emp.designation.toLowerCase().includes(searchValue);

    const matchesDepartment =
      departmentFilter === "All" ||
      emp.department === departmentFilter;

    const matchesStatus =
      statusFilter === "All" ||
      emp.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Format salary
  const formatSalary = (salary) =>
    Number(salary).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  return (
    <section
      id="employees"
      className="min-w-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 lg:p-6"
    >
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">
            {role === "MANAGER"
              ? "Department Employees"
              : "Employee Directory"}
          </h2>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            {role === "MANAGER"
              ? "View employees in your department."
              : "Manage and view all your employees."}
          </p>
        </div>

        <span className="rounded-full bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-600">
          {filteredEmployees.length} records
        </span>
      </div>

      {/* Search and Filters */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full min-w-0 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
        >
          <option value="All">All Departments</option>

          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Employee Table */}
      <div className="w-full overflow-x-auto rounded-lg">
        {loading ? (
          <p className="py-16 text-center text-sm text-slate-400">
            Loading employees...
          </p>
        ) : filteredEmployees.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-400">
            No employees found.
          </p>
        ) : (
          <table className="w-full min-w-[750px] text-left">
            <thead>
              <tr className="border-b bg-slate-50 text-xs uppercase text-slate-400">
                <th className="whitespace-nowrap px-4 py-4">
                  Employee
                </th>

                <th className="whitespace-nowrap px-4 py-4">
                  Department
                </th>

                <th className="whitespace-nowrap px-4 py-4">
                  Designation
                </th>

                <th className="whitespace-nowrap px-4 py-4">
                  Joining Date
                </th>

                {role === "HR" && (
                  <>
                    <th className="whitespace-nowrap px-4 py-4">
                      Salary
                    </th>

                    <th className="whitespace-nowrap px-4 py-4">
                      Actions
                    </th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b transition hover:bg-violet-50/40"
                >
                  <td className="whitespace-nowrap px-4 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {employee.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {employee.email}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {employee.department_name || employee.department}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {employee.designation}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {new Date(
                      `${employee.joining_date}T00:00:00`
                    ).toLocaleDateString("en-IN")}
                  </td>

                  {/* HR-only columns */}
                  {role === "HR" && (
                    <>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-700">
                        {formatSalary(employee.salary)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEdit?.(employee)}
                            className="rounded-md bg-violet-50 px-3 py-2 text-xs font-medium text-violet-600 transition hover:bg-violet-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => onDelete?.(employee.id)}
                            className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile scroll hint */}
      {!loading && filteredEmployees.length > 0 && (
        <p className="mt-3 text-xs text-slate-400 sm:hidden">
          Swipe horizontally to view all table columns →
        </p>
      )}
    </section>
  );
}

export default EmployeeTable;
