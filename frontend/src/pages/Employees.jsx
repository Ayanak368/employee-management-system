
import { useEffect, useState } from "react";
import API from "../services/api";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let endpoint = "list/";

        if (role === "MANAGER") {
          endpoint = "manager/employees/";
        } else if (role === "EMPLOYEE") {
          endpoint = "my-profile/";
        }

        const response = await API.get(endpoint);

        setEmployees(
          role === "EMPLOYEE"
            ? response.data ? [response.data] : []
            : response.data
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [role]);

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

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-slate-400">
            Workspace / Employees
          </p>

          <h1 className="text-2xl font-bold text-slate-800">
            Employees
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage employee information.
          </p>
        </div>

        {/* Total Employees */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Employees
          </p>

          <h2 className="mt-2 text-3xl font-bold text-violet-600">
            {employees.length}
          </h2>
        </div>

        {/* Employee Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
            <h2 className="font-semibold text-slate-800">
              Employee List
            </h2>

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
          ) : error ? (
            <p className="p-6 text-center text-red-500">
              {error}
            </p>
          ) : filteredEmployees.length === 0 ? (
            <p className="p-6 text-center text-slate-500">
              No employees found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-t hover:bg-slate-50"
                    >
                      <td className="p-4">{employee.id}</td>

                      <td className="p-4 font-medium">
                        {employee.name}
                      </td>

                      <td className="p-4">{employee.email}</td>

                      <td className="p-4">
                        {employee.department_name}
                      </td>

                      <td className="p-4">
                        {employee.designation}
                      </td>

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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Employees;
