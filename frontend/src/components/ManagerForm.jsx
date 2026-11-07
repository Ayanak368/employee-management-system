import { useState } from "react";

function ManagerForm({ departments, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 className="mb-5 text-xl font-bold">Create Manager</h2>

        <label className="mb-1 block text-sm font-medium">Manager Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Enter manager name"
        />

        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Enter email"
        />

        <label className="mb-1 block text-sm font-medium">Department</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="mb-5 w-full rounded-lg border p-3"
        >
          <option value="">Select department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-4 py-2 text-white"
          >
            Create Manager
          </button>
        </div>
      </form>
    </div>
  );
}

export default ManagerForm;