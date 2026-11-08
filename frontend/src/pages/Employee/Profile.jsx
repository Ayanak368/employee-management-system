
import { useEffect, useState } from "react";

import { getMyProfile } from "../../services/api/profileAPI";
import ChangePassword from "../../components/ChangePassword";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch employee profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setProfile(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <p className="text-gray-500">
        Loading profile...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-500">
        {error}
      </p>
    );
  }

  const details = [
    ["Full Name", profile.name],
    ["Username", profile.username],
    ["Email", profile.email],
    ["Role", profile.role],
    ["Department", profile.department || "Not assigned"],
    ["Designation", profile.designation || "-"],
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Profile
        </h1>

        <p className="text-gray-500">
          View your account information.
        </p>
      </div>

      {/* Profile Details */}
      <div className="max-w-2xl rounded-xl border bg-white p-6 shadow-sm">

        {/* Profile Header */}
        <div className="flex items-center gap-4 border-b pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-2xl font-bold text-violet-700">
            {profile.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {profile.name}
            </h2>

            <p className="text-gray-500">
              {profile.role}
            </p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="divide-y">
          {details.map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between"
            >
              <span className="text-gray-500">
                {label}
              </span>

              <span className="font-medium text-gray-800">
                {value || "-"}
              </span>
            </div>
          ))}
        </div>

        {/* Change Password */}
        <ChangePassword />

      </div>
    </div>
  );
}

export default Profile;
