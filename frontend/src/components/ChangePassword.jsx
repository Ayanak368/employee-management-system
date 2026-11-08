
import { useState } from "react";
import { changePassword } from "../services/api/profileAPI";

function ChangePassword() {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle password update
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({ text: "", type: "" });

    // Check whether passwords match
    if (formData.new_password !== formData.confirm_password) {
      setMessage({
        text: "New passwords do not match.",
        type: "error",
      });
      return;
    }

    try {
      const response = await changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
      });

      setMessage({
        text: response.data.message || "Password changed successfully!",
        type: "success",
      });

      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      const errorData = error.response?.data;

      const errorMessage =
        errorData?.current_password?.[0] ||
        errorData?.new_password?.[0] ||
        errorData?.detail ||
        errorData?.message ||
        "Unable to change password. Please try again.";

      setMessage({
        text: errorMessage,
        type: "error",
      });
    }
  };

  // Close modal
  const closeModal = () => {
    setIsOpen(false);
    setMessage({ text: "", type: "" });

    setFormData({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
  };

  return (
    <>
      {/* Change Password Button */}
      <button
        onClick={() => {
          setMessage({ text: "", type: "" });
          setIsOpen(true);
        }}
        className="mt-6 rounded-lg bg-purple-600 px-5 py-3 text-white hover:bg-purple-700"
      >
        Change Password
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Change Password
              </h2>

              <button
                type="button"
                onClick={closeModal}
                className="text-2xl text-gray-500 hover:text-black"
              >
                &times;
              </button>
            </div>

            {/* Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="mb-2 block">
                  Current Password
                </label>

                <input
                  type="password"
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="mb-2 block">
                  New Password
                </label>

                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="mb-2 block">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-purple-600"
                />
              </div>

              {/* Success / Error Message */}
              {message.text && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border px-5 py-2 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-5 py-2 text-white hover:bg-purple-700"
                >
                  Update Password
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ChangePassword;
