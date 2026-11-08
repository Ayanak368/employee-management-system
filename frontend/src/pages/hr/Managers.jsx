import { useEffect, useState } from "react";
import {
  getManagers,
  deleteManager,
} from "../../services/api/managerAPI";

function Managers() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch managers
  const fetchManagers = async () => {
    try {
      const response = await getManagers();
      setManagers(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load managers.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // Delete manager
  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name || "this manager"}? Their login account will also be deleted.`
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await deleteManager(id);

      setManagers((current) =>
        current.filter((manager) => manager.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete manager.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-slate-400">
            Workspace / Managers
          </p>

          <h1 className="text-2xl font-bold text-slate-800">
            Managers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your department managers.
          </p>
        </div>

        {/* Total Managers */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Managers
          </p>

          <h2 className="mt-2 text-3xl font-bold text-violet-600">
            {managers.length}
          </h2>
        </div>

        {/* Manager Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="font-semibold text-slate-800">
              Manager List
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-center text-slate-500">
              Loading managers...
            </p>
          ) : error ? (
            <p className="p-6 text-center text-red-500">
              {error}
            </p>
          ) : managers.length === 0 ? (
            <p className="p-6 text-center text-slate-500">
              No managers found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {managers.map((manager) => (
                    <tr
                      key={manager.id}
                      className="border-t hover:bg-slate-50"
                    >
                      <td className="p-4 font-medium">
                        {manager.name || "Not available"}
                      </td>

                      <td className="p-4">
                        {manager.email || "Not available"}
                      </td>

                      <td className="p-4">
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-700">
                          {manager.department_name || "Not assigned"}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() =>
                            handleDelete(manager.id, manager.name)
                          }
                          disabled={deletingId === manager.id}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId === manager.id
                            ? "Deleting..."
                            : "Delete"}
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
    </div>
  );
}

export default Managers;