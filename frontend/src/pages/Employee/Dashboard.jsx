
import { useEffect, useState } from "react";
import { getMyTasks } from "../../services/api/taskAPI";

function EmployeeDashboard() {
  const username = localStorage.getItem("username");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employee tasks
  const fetchTasks = async () => {
    try {
      const response = await getMyTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Task statistics
  const pending = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const today = new Date().toISOString().split("T")[0];

  // Upcoming tasks
  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.status !== "Completed" &&
        task.due_date >= today
    )
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 5);

  // Statistics cards
  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: "▤",
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Pending",
      value: pending,
      icon: "◷",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: "↻",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Completed",
      value: completed,
      icon: "✓",
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen min-w-0 bg-slate-50 text-slate-800">
      <main className="mx-auto min-w-0 w-full max-w-[1600px] p-3 sm:p-5 lg:p-8">

        {/* Welcome Banner */}
        <section className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 p-5 text-white sm:mb-7 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="mb-2 text-lg font-bold sm:text-xl">
              Welcome back, {username || "User"} 👋
            </h2>

            <p className="text-xs text-violet-100 sm:text-sm">
              Here's an overview of your assigned work.
            </p>
          </div>

          <span className="w-fit rounded-lg bg-white/15 px-4 py-2 text-xs sm:text-sm">
            {new Date().toLocaleDateString("en-IN")}
          </span>
        </section>

        {/* Statistics */}
        {loading ? (
          <p className="py-6 text-center text-slate-500">
            Loading dashboard...
          </p>
        ) : (
          <>
            <section className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      {stat.title}
                    </p>

                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl ${stat.color}`}>
                      {stat.icon}
                    </span>
                  </div>

                  <h2 className="mt-3 text-3xl font-bold text-slate-800">
                    {stat.value}
                  </h2>
                </div>
              ))}
            </section>

            {/* Upcoming Deadlines */}
            <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <h2 className="text-lg font-semibold text-slate-800">
                  Upcoming Deadlines
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your next five pending and ongoing tasks.
                </p>
              </div>

              {upcomingTasks.length === 0 ? (
                <p className="p-6 text-center text-slate-500">
                  No upcoming tasks.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="p-4 font-semibold">Task</th>
                        <th className="p-4 font-semibold">Priority</th>
                        <th className="p-4 font-semibold">Due Date</th>
                        <th className="p-4 font-semibold">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {upcomingTasks.map((task) => (
                        <tr
                          key={task.id}
                          className="border-t border-slate-100 transition hover:bg-slate-50"
                        >
                          <td className="p-4 font-medium text-slate-700">
                            {task.title}
                          </td>

                          <td className="p-4">
                            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                              {task.priority}
                            </span>
                          </td>

                          <td className="p-4 text-slate-600">
                            {task.due_date}
                          </td>

                          <td className="p-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                task.status === "Completed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : task.status === "In Progress"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-4 text-center text-xs text-slate-400 sm:flex-row sm:justify-between sm:text-left">
          <span>Employify Employee Management System</span>
          <span>Built with React, Tailwind CSS & Django</span>
        </footer>
      </main>
    </div>
  );
}

export default EmployeeDashboard;
