
import { useEffect, useState } from "react";
import { getManagerEmployees } from "../../services/api/managerAPI";
import { addTask } from "../../services/api/taskAPI";

const initialForm = {
  title: "",
  description: "",
  assigned_to: "",
  priority: "Medium",
  due_date: "",
};

function AssignTask() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getManagerEmployees();
      setEmployees(response.data);
    } catch (err) {
      setError("Failed to load employees.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await addTask(formData);

      setMessage("Task assigned successfully!");
      setFormData(initialForm);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Failed to assign task."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Assign Task
        </h1>
        <p className="text-gray-500">
          Assign work to employees in your department.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl shadow-sm p-6 space-y-5"
      >
        {message && (
          <p className="bg-green-50 text-green-700 p-3 rounded-lg">
            {message}
          </p>
        )}

        {error && (
          <p className="bg-red-50 text-red-600 p-3 rounded-lg">
            {error}
          </p>
        )}

        <div>
          <label className="block font-medium mb-2">
            Task Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the task"
            rows="4"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Assign To
          </label>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-medium mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || employees.length === 0}
          className="w-full bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700 disabled:opacity-50"
        >
          {saving ? "Assigning..." : "Assign Task"}
        </button>
      </form>
    </div>
  );
}

export default AssignTask;
