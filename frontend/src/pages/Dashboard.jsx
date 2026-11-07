
import { useEffect, useMemo, useState } from "react";

import API from "../services/api";
import StatCard from "../components/StatCard";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeForm from "../components/EmployeeForm";
import ManagerForm from "../components/ManagerForm";
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
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [showManagerModal, setShowManagerModal] = useState(false);
  const [managerCredentials, setManagerCredentials] = useState(null);

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
  const [credentials, setCredentials] = useState(null);

  // Format API errors
  const getErrorMessage = (err) => {
    const data = err.response?.data;

    if (data && typeof data === "object") {
      return Object.entries(data)
        .map(([field, errors]) => {
          const message = Array.isArray(errors)
            ? errors.join(", ")
            : typeof errors === "object"
              ? JSON.stringify(errors)
              : errors;

          return `${field}: ${message}`;
        })
        .join("\n");
    }

    return err.message || "Something went wrong";
  };

  // Fetch employees according to role
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      let endpoint = "list/";

      if (role === "MANAGER") {
        endpoint = "manager/employees/";
      } else if (role === "EMPLOYEE") {
        endpoint = "my-profile/";
      }

      const response = await API.get(endpoint);

      // Employee profile endpoint returns one object
      if (role === "EMPLOYEE") {
        setEmployees(response.data ? [response.data] : []);
      } else {
        setEmployees(response.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await API.get("departments/");
      setDepartments(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Fetch HR dashboard statistics
  const fetchDashboardStats = async () => {
    if (role !== "HR") return;

    try {
      const response = await API.get("dashboard-stats/");
      setDashboardStats(response.data);
    } catch (err) {
      console.log("Dashboard statistics error:", err.response?.data);
    }
  };

  // Load dashboard data
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchDashboardStats();
  }, []);

  // Department names for EmployeeTable
  const departmentNames = useMemo(
    () => departments.map((department) => department.name),
    [departments]
  );

  // Open add employee form
  const openAddForm = () => {
    setEditId(null);
    setFormData({ ...emptyForm });
    setCredentials(null);
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

    setCredentials(null);
    setError("");
    setShowModal(true);
  };

  // Handle employee form changes
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
      setCredentials(null);

      if (editId) {
        await API.put(`list/${editId}/`, formData);
        setMessage("Employee updated successfully!");
      } else {
        const response = await API.post("list/", formData);

        setCredentials(response.data.login_credentials);
        setMessage("Employee and login account created successfully!");
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

  // Create manager account
const handleCreateManager = async (formData) => {
  try {
    setError("");
    setManagerCredentials(null);

    const response = await API.post("managers/", formData);

    console.log("Manager response:", response.data);

    setManagerCredentials(response.data);
    setShowManagerModal(false);
    setMessage("Manager account created successfully!");

  } catch (err) {
    console.log("Status:", err.response?.status);
    console.log("Backend error:", err.response?.data);

    alert(JSON.stringify(err.response?.data, null, 2));
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
      setCredentials(null);

      await API.delete(`list/${id}/`);

      setMessage("Employee deleted successfully!");

      await fetchEmployees();
      await fetchDashboardStats();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Close employee form
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
        {role === "HR" && (
          <Navbar
            onAddEmployee={openAddForm}
            onAddManager={() => {
              setError("");
              setManagerCredentials(null);
              setShowManagerModal(true);
            }}
          />
        )}

        {/* Welcome Banner */}
        <section className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 p-5 text-white sm:mb-7 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="mb-2 text-lg font-bold sm:text-xl">
              Welcome back, {username || "User"} 👋
            </h2>

            <p className="text-xs text-violet-100 sm:text-sm">
              Here's what's happening with your workforce today.
            </p>
          </div>

          <span className="w-fit rounded-lg bg-white/15 px-4 py-2 text-xs sm:text-sm">
            {new Date().toLocaleDateString("en-IN")}
          </span>
        </section>

        {/* HR Statistics */}
        {role === "HR" && (
          <section className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </section>
        )}

        {/* Success Message */}
        {message && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>{message}</span>

            <button
              onClick={() => setMessage("")}
              className="shrink-0 font-semibold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Employee Credentials */}
        {credentials && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <h3 className="mb-3 font-semibold text-emerald-800">
              Employee Login Credentials
            </h3>

            <p className="text-sm">
              Username: <strong>{credentials.username}</strong>
            </p>

            <p className="mt-2 text-sm">
              Temporary Password:{" "}
              <strong>{credentials.temporary_password}</strong>
            </p>

            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  `Username: ${credentials.username}\nPassword: ${credentials.temporary_password}`
                )
              }
              className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
            >
              Copy Credentials
            </button>

            <button
              onClick={() => setCredentials(null)}
              className="ml-3 text-sm text-slate-600"
            >
              Close
            </button>
          </div>
        )}

        {/* Manager Credentials */}
        {managerCredentials && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="mb-3 font-bold text-emerald-800">
              Manager Account Created Successfully!
            </h3>

            <div className="space-y-2 text-sm text-slate-700">
              <p>
                Name: <strong>{managerCredentials.name}</strong>
              </p>

              <p>
                Department: <strong>{managerCredentials.department}</strong>
              </p>

              <p>
                Username: <strong>{managerCredentials.username}</strong>
              </p>

              <p>
                Temporary Password:{" "}
                <strong>{managerCredentials.temporary_password}</strong>
              </p>
            </div>

            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  `Name: ${managerCredentials.name}\nDepartment: ${managerCredentials.department}\nUsername: ${managerCredentials.username}\nPassword: ${managerCredentials.temporary_password}`
                )
              }
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
            >
              Copy Credentials
            </button>

            <button
              onClick={() => setManagerCredentials(null)}
              className="ml-3 text-sm text-slate-600"
            >
              Close
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && !showModal && !showManagerModal && (
          <div className="mb-5 flex items-start justify-between gap-3 whitespace-pre-line rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="shrink-0 font-semibold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Employee Table */}
        <EmployeeTable
          employees={employees}
          loading={loading}
          role={role}
          search={search}
          setSearch={setSearch}
          departments={departmentNames}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onEdit={role === "HR" ? handleEdit : undefined}
          onDelete={role === "HR" ? handleDelete : undefined}
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
        departments={departments}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      {/* Add Manager Form */}
      {showManagerModal && (
        <ManagerForm
          departments={departments}
          onSubmit={handleCreateManager}
          onClose={() => setShowManagerModal(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
