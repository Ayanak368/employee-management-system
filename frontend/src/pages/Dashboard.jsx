
import { useEffect, useMemo, useState } from "react";

import API from "../services/api";
import StatCard from "../components/StatCard";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeForm from "../components/EmployeeForm";
import Navbar from "../components/Navbar";

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

function Dashboard() {
  const [employees, setEmployees] = useState([]);

  const [dashboardStats, setDashboardStats] = useState({
    total_employees: 0,
    active_employees: 0,
    inactive_employees: 0,
    total_departments: 0,
  });

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

  // Format API errors
  const getErrorMessage = (err) => {
    const data = err.response?.data;

    if (data && typeof data === "object") {
      return Object.entries(data)
        .map(([field, errors]) =>
          `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`
        )
        .join("\n");
    }

    return err.message || "Something went wrong";
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await API.get("list/");
      setEmployees(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const response = await API.get("dashboard-stats/");
      setDashboardStats(response.data);
    } catch (err) {
      console.error(getErrorMessage(err));
    }
  };

  // Load data when dashboard opens
  useEffect(() => {
    fetchEmployees();
    fetchDashboardStats();
  }, []);

  // Get unique departments
  const departments = useMemo(
    () => [...new Set(employees.map((emp) => emp.department))],
    [employees]
  );

  // Open add form
  const openAddForm = () => {
    setEditId(null);
    setFormData({ ...emptyForm });
    setError("");
    setShowModal(true);
  };

  // Open edit form
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

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Add or update employee
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

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

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

  // Close form
  const closeForm = () => {
    setShowModal(false);
    setError("");
  };

  // Statistics cards
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
    <div className="min-h-screen min-w-0 bg-slate-50 text-slate-800">
      <main className="mx-auto min-w-0 w-full max-w-[1600px] p-3 sm:p-5 lg:p-8">

        {/* Navbar */}
        <Navbar onAddEmployee={openAddForm} />

        {/* Welcome Banner */}
        <section className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 p-5 text-white sm:mb-7 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="mb-2 text-lg font-bold sm:text-xl">
              Welcome back, Admin 👋
            </h2>

            <p className="text-xs text-violet-100 sm:text-sm">
              Here's what's happening with your workforce today.
            </p>
          </div>

          <span className="w-fit rounded-lg bg-white/15 px-4 py-2 text-xs sm:text-sm">
            {new Date().toLocaleDateString("en-IN")}
          </span>
        </section>

        {/* Statistics */}
        <section className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        {/* Success Message */}
        {message && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>{message}</span>

            <button
              onClick={() => setMessage("")}
              className="shrink-0 font-semibold"
              aria-label="Close message"
            >
              ✕
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && !showModal && (
          <div className="mb-5 flex items-start justify-between gap-3 whitespace-pre-line rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="shrink-0 font-semibold"
              aria-label="Close error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Employee Table */}
        <EmployeeTable
          employees={employees}
          loading={loading}
          search={search}
          setSearch={setSearch}
          departments={departments}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Footer */}
        <footer className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-4 text-center text-xs text-slate-400 sm:mt-7 sm:flex-row sm:justify-between sm:text-left">
          <span>Employify Employee Management System</span>
          <span>Built with React, Tailwind CSS & Django</span>
        </footer>
      </main>

      {/* Add/Edit Employee Form */}
      <EmployeeForm
        showModal={showModal}
        formData={formData}
        editId={editId}
        saving={saving}
        error={error}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />
    </div>
  );
}

export default Dashboard;
