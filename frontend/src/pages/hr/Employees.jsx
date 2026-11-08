
import { useEffect, useState } from "react";
import EmployeeForm from "../../components/EmployeeForm";

import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  resetPassword,
} from "../../services/api/employeeAPI";

import { getDepartments } from "../../services/api/departmentAPI";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  joining_date: "",
  salary: "",
  status: "Active",
};

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // Newly created employee credentials
  const [credentials, setCredentials] = useState(null);

  // Reset password credentials
  const [resetCredentials, setResetCredentials] = useState(null);

  const role = localStorage.getItem("role");

  // ==================================
  // FETCH EMPLOYEES
  // ==================================

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  // ==================================
  // FETCH DEPARTMENTS
  // ==================================

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // ==================================
  // OPEN ADD EMPLOYEE FORM
  // ==================================

  const handleAdd = () => {
    setEditId(null);
    setFormData(initialFormData);
    setError("");
    setShowModal(true);
  };

  // ==================================
  // OPEN EDIT EMPLOYEE FORM
  // ==================================

  const handleEdit = (employee) => {
    setEditId(employee.id);

    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      joining_date: employee.joining_date || "",
      salary: employee.salary || "",
      status: employee.status || "Active",
    });

    setError("");
    setShowModal(true);
  };

  // ==================================
  // RESET PASSWORD
  // ==================================

  const handleResetPassword = async (employee) => {
    const confirmReset = window.confirm(
      `Generate a new password for ${employee.name}?`
    );

    if (!confirmReset) return;

    try {
      const response = await resetPassword(employee.id);
      setResetCredentials(response.data);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to reset password.");
    }
  };

  // ==================================
  // HANDLE FORM INPUT CHANGES
  // ==================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==================================
  // ADD OR UPDATE EMPLOYEE
  // ==================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      let response;

      if (editId) {
        // Update employee
        response = await updateEmployee(editId, formData);
      } else {
        // Create employee and login account
        response = await addEmployee(formData);
      }

      // Show credentials only after employee creation
      if (!editId && response.data.login_credentials) {
        setCredentials(response.data.login_credentials);
      }

      setShowModal(false);
      setEditId(null);
      setFormData(initialFormData);

      await fetchEmployees();
    } catch (err) {
      console.error(err);

      const errorData = err.response?.data;

      setError(
        typeof errorData === "object"
          ? Object.entries(errorData)
              .map(
                ([key, value]) =>
                  `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
              )
              .join(" | ")
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================
  // DELETE EMPLOYEE
  // ==================================

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}? Their login account will also be deleted.`
    );

    if (!confirmed) return;

    try {
      await deleteEmployee(employee.id);

      setEmployees((previous) =>
        previous.filter((item) => item.id !== employee.id)
      );

      alert("Employee deleted successfully.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to delete employee.");
    }
  };

  // ==================================
  // FILTER EMPLOYEES
  // ==================================

  const filteredEmployees = employees.filter((employee) =>
    [
      employee.name,
      employee.email,
      employee.designation,
      employee.department_name,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ==================================
  // UI
  // ==================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">Workspace / Employees</p>

            <h1 className="text-2xl font-bold text-slate-800">Employees</h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage employee information.
            </p>
          </div>

          {role === "HR" && (
            <button
              onClick={handleAdd}
              className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              + Add Employee
            </button>
          )}
        </div>

        {/* Total Employees */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Employees</p>

          <h2 className="mt-2 text-3xl font-bold text-violet-600">
            {employees.length}
          </h2>
        </div>

        {/* Employee Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
            <h2 className="font-semibold text-slate-800">Employee List</h2>

            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-violet-500 sm:w-64"
            />
          </div>

          {loading ? (
            <p className="p-6 text-center text-slate-500">
              Loading employees...
            </p>
          ) : error && !showModal ? (
            <p className="p-6 text-center text-red-500">{error}</p>
          ) : filteredEmployees.length === 0 ? (
            <p className="p-6 text-center text-slate-500">
              No employees found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">Status</th>

                    {role === "HR" && <th className="p-4">Actions</th>}
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-t hover:bg-slate-50"
                    >
                      <td className="p-4 font-medium">{employee.name}</td>

                      <td className="p-4">{employee.email}</td>

                      <td className="p-4">
                        {employee.department_name || "-"}
                      </td>

                      <td className="p-4">{employee.designation}</td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            employee.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>

                      {/* HR Actions */}
                      {role === "HR" && (
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(employee)}
                              className="rounded-md bg-violet-50 px-3 py-2 text-xs font-medium text-violet-600 hover:bg-violet-100"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(employee)}
                              className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                            >
                              Delete
                            </button>

                            <button
                              onClick={() => handleResetPassword(employee)}
                              className="text-orange-600 hover:text-orange-800"
                            >
                              Reset Password
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Employee Form Modal */}
        {role === "HR" && (
          <EmployeeForm
            showModal={showModal}
            formData={formData}
            editId={editId}
            saving={saving}
            error={error}
            departments={departments}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowModal(false);
              setError("");
            }}
          />
        )}

        {/* Reset Password Modal */}
        {resetCredentials && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">
                Password Reset Successful
              </h2>

              <p className="mb-2">
                Username: {resetCredentials.username}
              </p>

              <p className="mb-4">
                Temporary Password: {resetCredentials.temporary_password}
              </p>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `Username: ${resetCredentials.username}\nPassword: ${resetCredentials.temporary_password}`
                  )
                }
                className="bg-orange-500 text-white px-4 py-2 rounded"
              >
                Copy Credentials
              </button>

              <button
                onClick={() => setResetCredentials(null)}
                className="ml-2 bg-gray-200 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Newly Created Employee Credentials */}
        {credentials && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-bold text-slate-800">
                Employee Created Successfully!
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Share these temporary login credentials with the employee.
                This is the only time the password will be displayed.
              </p>

              <div className="mt-5 space-y-3 rounded-lg bg-slate-50 p-4">
                <div>
                  <p className="text-xs text-slate-400">Username</p>
                  <p className="font-semibold text-slate-800">
                    {credentials.username}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Temporary Password</p>

                  <div className="flex items-center justify-between gap-2">
                    <p className="break-all font-semibold text-slate-800">
                      {credentials.temporary_password}
                    </p>

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          credentials.temporary_password
                        )
                      }
                      className="rounded-lg bg-violet-100 px-3 py-2 text-xs font-semibold text-violet-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCredentials(null)}
                className="mt-5 w-full rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Employees;
