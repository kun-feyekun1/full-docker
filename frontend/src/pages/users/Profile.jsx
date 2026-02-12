import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"
import userService from "../../services/user/userService";

export default function Profile() {
  const { user } = useAuth(); // logged-in user (from auth context)
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.fetchProfile();
        setProfile(data); // backend returns user directly
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-semibold">
          {profile.name?.[0]?.toUpperCase()}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {profile.name}
          </h1>
          <p className="text-gray-500">{profile.email}</p>
          <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
            {profile.role.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Personal Information
          </h2>

          <InfoRow label="Full Name" value={profile.name} />
          <InfoRow label="Email Address" value={profile.email} />
          <InfoRow label="Phone Number" value={profile.phone || "Not provided"} />
          <InfoRow label="Location" value={profile.location || "Not specified"} />
        </div>

        {/* Account Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Account Details
          </h2>

          <InfoRow
            label="Account Created"
            value={new Date(profile.createdAt).toLocaleDateString()}
          />
          <InfoRow
            label="Last Updated"
            value={new Date(profile.updatedAt).toLocaleDateString()}
          />
          <InfoRow label="User ID" value={`#${profile.id}`} />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <button className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
          Edit Profile
        </button>
        <button className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
          Change Password
        </button>
      </div>
    </div>
  );
}

/* Reusable row */
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b last:border-none">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}
