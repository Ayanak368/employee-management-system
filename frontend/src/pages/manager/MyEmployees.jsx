
import { useEffect, useState } from "react";
import { getManagerEmployees } from "../../services/api/managerAPI";

function MyEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getManagerEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Employees
        </h1>
        <p className="text-gray-500">
          View employees in your department.
        </p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-5 border-b flex justify-between">
          <h2 className="font-semibold text-lg">
            Employee List
          </h2>
          <span className="text-sm text-gray-500">
            Total: {employees.length}
          </span>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">
            Loading employees...
          </p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : employees.length === 0 ? (
          <p className="p-6 text-gray-500">
            No employees found in your department.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-t">
                    <td className="p-4 font-medium">
                      {employee.name}
                    </td>
                    <td className="p-4">{employee.email}</td>
                    <td className="p-4">{employee.phone}</td>
                    <td className="p-4">
                      {employee.designation}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          employee.status === "Active"
                            ? "bg-green-100 text-green-700"
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
  );
}

export default MyEmployees;
