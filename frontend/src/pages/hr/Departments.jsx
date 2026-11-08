import { useEffect, useState } from "react";

import {
  getDepartments,
  addDepartment,
  updateDepartment,
} from "../../services/api/departmentAPI";

const initialFormData = {
  name: "",
  description: "",
};

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Open modal for adding
  const handleAdd = () => {
    setEditId(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (department) => {
    setEditId(department.id);

    setFormData({
      name: department.name,
      description: department.description || "",
    });

    setShowModal(true);
  };

  // Add or update department
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editId) {
        await updateDepartment(editId, formData);
      } else {
        await addDepartment(formData);
      }

      setShowModal(false);
      setFormData(initialFormData);
      setEditId(null);

      await fetchDepartments();
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.name?.[0] ||
          "Failed to save department."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Departments
          </h1>

          <p className="text-gray-500">
            Manage all departments here.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700"
        >
          + Add Department
        </button>
      </div>

      {/* Department Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold">
            Department List
          </h2>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">
            Loading departments...
          </p>
        ) : error ? (
          <p className="p-6 text-red-500">
            {error}
          </p>
        ) : departments.length === 0 ? (
          <p className="p-6 text-gray-500">
            No departments found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4">Department Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Employees</th>
                  <th className="p-4">Manager</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {departments.map((department) => (
                  <tr
                    key={department.id}
                    className="border-t"
                  >
                    <td className="p-4 font-medium">
                      {department.name}
                    </td>

                    <td className="p-4 text-gray-600">
                      {department.description || "-"}
                    </td>

                    <td className="p-4">
                      {department.employee_count}
                    </td>

                    <td className="p-4">
                      {department.manager_names?.length > 0
                        ? department.manager_names.join(", ")
                        : "Not Assigned"}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleEdit(department)}
                        className="bg-purple-50 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-bold">
              {editId ? "Edit Department" : "Add Department"}
            </h2>

            <div>
              <label className="block mb-1 font-medium">
                Department Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter department name"
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="w-full border rounded-lg p-3"
                rows="3"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editId
                    ? "Update Department"
                    : "Add Department"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Departments;