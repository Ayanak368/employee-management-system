import { useEffect, useMemo, useState } from "react";
import API from "./services/api";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  joining_date: "",
  salary: "",
  status: "Active",
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [dashboardStats, setDashboardStats] = useState({
    total_employees: 0,
    active_employees: 0,
    inactive_employees: 0,
    total_departments: 0,
  });

  // Format API errors
  const getErrorMessage = (err) => {
    const data = err.response?.data;

    if (data && typeof data === "object") {
      return Object.entries(data)
        .map(([field, errors]) => {
          const errorText = Array.isArray(errors)
            ? errors.join(", ")
            : errors;

          return `${field}: ${errorText}`;
        })
        .join("\n");
    }

    return err.message || "Something went wrong";
  };

  // GET: Fetch all employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("list/");

      setEmployees(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // GET: Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const response = await API.get("dashboard-stats/");

      setDashboardStats(response.data);
    } catch (err) {
      console.error(
        "Dashboard statistics error:",
        getErrorMessage(err)
      );
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchEmployees();
    fetchDashboardStats();
  }, []);

  // Get unique departments
  const departments = useMemo(() => {
    return [
      ...new Set(employees.map((emp) => emp.department)),
    ];
  }, [employees]);

  // Search and filters
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
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

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [employees, search, departmentFilter, statusFilter]);

  // Open add employee form
  const openAddForm = () => {
    setEditId(null);
    setFormData({ ...emptyForm });
    setError("");
    setShowModal(true);
  };

  // Open edit employee form
  const handleEdit = (employee) => {
    setEditId(employee.id);

    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      designation: employee.designation,
      joining_date: employee.joining_date,
      salary: employee.salary,
      status: employee.status,
    });

    setError("");
    setShowModal(true);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // POST: Add employee
  // PUT: Update employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editId) {
        await API.put(`${editId}/`, formData);

        setMessage("Employee updated successfully!");
      } else {
        await API.post("list/", formData);

        setMessage("Employee added successfully!");
      }

      setShowModal(false);
      setFormData({ ...emptyForm });
      setEditId(null);

      await fetchEmployees();
      await fetchDashboardStats();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // DELETE: Delete employee
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await API.delete(`${id}/`);

      setMessage("Employee deleted successfully!");

      await fetchEmployees();
      await fetchDashboardStats();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Format salary
  const formatSalary = (salary) => {
    return Number(salary).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  // Dashboard cards
  const stats = [
    {
      title: "Total Employees",
      value: dashboardStats.total_employees,
      icon: "♙",
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Active Employees",
      value: dashboardStats.active_employees,
      icon: "✓",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Inactive Employees",
      value: dashboardStats.inactive_employees,
      icon: "◷",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Departments",
      value: dashboardStats.total_departments,
      icon: "▤",
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">

      {/* Sidebar */}
      <aside className="flex w-full shrink-0 flex-col bg-slate-900 p-5 text-white md:min-h-screen md:w-64">

        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600 text-xl font-bold">
            E
          </div>

          <h1 className="text-xl font-bold tracking-wide">
            Employify
          </h1>
        </div>

        <p className="mb-3 text-xs font-semibold tracking-widest text-slate-400">
          WORKSPACE
        </p>

        <nav className="flex gap-2 md:flex-col">
          <a
            href="#dashboard"
            className="flex items-center gap-3 rounded-lg bg-violet-600 px-4 py-3 text-sm font-medium text-white"
          >
            <span>▦</span>
            Dashboard
          </a>

          <a
            href="#employees"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <span>♙</span>
            Employees
          </a>
        </nav>

        <div className="mt-8 hidden items-center gap-3 border-t border-slate-700 pt-6 md:mt-auto md:flex">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-violet-500 font-bold">
            AD
          </div>

          <div>
            <p className="text-sm font-semibold">
              Admin User
            </p>

            <p className="text-xs text-slate-400">
              Administrator
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">

          <div>
            <p className="mb-1 text-xs text-slate-400">
              Workspace / Dashboard
            </p>

            <h2 className="text-2xl font-bold text-slate-900">
              Dashboard
            </h2>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            + Add Employee
          </button>
        </header>

        {/* Welcome banner */}
        <section
          id="dashboard"
          className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 p-6 text-white shadow-lg shadow-violet-100"
        >
          <div>
            <h2 className="mb-2 text-xl font-bold">
              Welcome back, Admin 👋
            </h2>

            <p className="text-sm text-violet-100">
              Here's what's happening with your workforce today.
            </p>
          </div>

          <span className="rounded-lg bg-white/15 px-4 py-2 text-sm">
            {new Date().toLocaleDateString("en-IN")}
          </span>
        </section>

        {/* Dashboard statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  {stat.title}
                </p>

                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl text-lg ${stat.color}`}
                >
                  {stat.icon}
                </div>
              </div>

              <h3 className="mt-4 text-3xl font-bold text-slate-800">
                {stat.value}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Current records
              </p>
            </div>
          ))}
        </section>

        {/* Success message */}
        {message && (
          <div className="mb-5 flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}

            <button onClick={() => setMessage("")}>
              ✕
            </button>
          </div>
        )}

        {/* Error message */}
        {error && !showModal && (
          <div className="mb-5 whitespace-pre-line rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Employee directory */}
        <section
          id="employees"
          className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
        >

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Employee Directory
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Manage and view all your employees.
              </p>
            </div>

            <span className="rounded-full bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-600">
              {filteredEmployees.length} records
            </span>
          </div>

          {/* Search and filters */}
          <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">

            <input
              type="text"
              placeholder="Search name, email or designation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
            >
              <option value="All">
                All Departments
              </option>

              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Employee table */}
          <div className="overflow-x-auto">

            {loading ? (
              <div className="py-16 text-center text-sm text-slate-400">
                Loading employees...
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-semibold text-slate-600">
                  No employees found
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[850px] text-left">

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-4 py-4">Employee</th>
                    <th className="px-4 py-4">Department</th>
                    <th className="px-4 py-4">Designation</th>
                    <th className="px-4 py-4">Joining Date</th>
                    <th className="px-4 py-4">Salary</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-slate-100 transition hover:bg-violet-50/40"
                    >

                      {/* Employee details */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">

                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-100 font-bold text-violet-600">
                            {employee.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="whitespace-nowrap text-sm font-semibold text-slate-700">
                              {employee.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {employee.department}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {employee.designation}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {new Date(
                          `${employee.joining_date}T00:00:00`
                        ).toLocaleDateString("en-IN")}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-700">
                        {formatSalary(employee.salary)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            employee.status === "Active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex gap-2">

                          <button
                            onClick={() => handleEdit(employee)}
                            className="rounded-md bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-600 hover:bg-violet-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-7 flex flex-wrap justify-between gap-2 text-xs text-slate-400">
          <span>Employify Employee Management System</span>
          <span>Built with React, Tailwind CSS & Django</span>
        </footer>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4"
          onClick={() => setShowModal(false)}
        >

          <div
            className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal header */}
            <div className="mb-7 flex items-start justify-between">

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editId ? "Edit Employee" : "Add New Employee"}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Enter employee information below.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-lg text-slate-500 hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            {/* Form error */}
            {error && (
              <div className="mb-5 whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Employee form */}
            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {[
                  ["name", "Full Name", "text"],
                  ["email", "Email Address", "email"],
                  ["phone", "Phone Number", "tel"],
                  ["department", "Department", "text"],
                  ["designation", "Designation", "text"],
                  ["joining_date", "Joining Date", "date"],
                  ["salary", "Salary (₹)", "number"],
                ].map(([name, label, type]) => (
                  <label key={name} className="block">

                    <span className="mb-2 block text-sm font-medium text-slate-600">
                      {label}
                    </span>

                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      required
                      min={type === "number" ? "0" : undefined}
                      step={type === "number" ? "0.01" : undefined}
                      className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />

                  </label>
                ))}

                {/* Employment status */}
                <label className="block">

                  <span className="mb-2 block text-sm font-medium text-slate-600">
                    Employment Status
                  </span>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                </label>
              </div>

              {/* Form buttons */}
              <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editId
                      ? "Update Employee"
                      : "Save Employee"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;