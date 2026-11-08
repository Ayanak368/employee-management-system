
import { useEffect, useState } from "react";

import {
  getMyTasks,
  updateTask,
} from "../../services/api/taskAPI";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch employee tasks
  const fetchTasks = async () => {
    try {
      const response = await getMyTasks();
      setTasks(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load your tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update task status
  const updateStatus = async (taskId, status) => {
    try {
      await updateTask(taskId, { status });

      await fetchTasks();
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Failed to update task status."
      );
    }
  };

  // Status styles
  const statusStyle = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Tasks
        </h1>

        <p className="text-gray-500">
          View your assigned tasks and update their progress.
        </p>
      </div>

      {/* Task List */}
      {loading ? (
        <p className="text-gray-500">
          Loading tasks...
        </p>
      ) : error ? (
        <p className="text-red-500">
          {error}
        </p>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border bg-white p-6">
          No tasks assigned to you yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
            >
              {/* Task Title and Status */}
              <div className="flex justify-between gap-3">
                <h2 className="text-lg font-semibold">
                  {task.title}
                </h2>

                <span
                  className={`h-fit rounded-full px-3 py-1 text-xs ${
                    statusStyle[task.status]
                  }`}
                >
                  {task.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600">
                {task.description ||
                  "No description provided."}
              </p>

              {/* Task Details */}
              <div className="space-y-1 text-sm text-gray-500">
                <p>Priority: {task.priority}</p>
                <p>Due Date: {task.due_date}</p>
              </div>

              {/* Update Status */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Update Status
                </label>

                <select
                  value={task.status}
                  onChange={(e) =>
                    updateStatus(task.id, e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">
                    In Progress
                  </option>
                  <option value="Completed">
                    Completed
                  </option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTasks;
