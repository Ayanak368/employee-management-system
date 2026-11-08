
import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../../services/api/taskAPI";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (err) {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) {
      return;
    }

    try {
      await deleteTask(task.id);
      fetchTasks();
    } catch (err) {
      alert("Failed to delete task.");
    }
  };

  const statusStyle = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Tasks
        </h1>
        <p className="text-gray-500">
          Manage tasks assigned to your department employees.
        </p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold">
            Task List ({tasks.length})
          </h2>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">Loading tasks...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="p-6 text-gray-500">
            No tasks assigned yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4">Task</th>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-t">
                    <td className="p-4">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        {task.description}
                      </p>
                    </td>

                    <td className="p-4">
                      {task.employee_name}
                    </td>

                    <td className="p-4">{task.priority}</td>

                    <td className="p-4">{task.due_date}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          statusStyle[task.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(task)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
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

export default Tasks;
