import React, { useState, useEffect } from "react";
import userService from "../../services/user/userService"; // <-- use your service

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Form states
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // User management functions
  const fetchUsers = async (page = 1, limit = 12) => {
    try {
      setLoading(true);
      const data = await userService.fetchUsers(page, limit);
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (error) {
      showMessage("error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (id) => {
    try {
      setLoading(true);
      const data = await userService.fetchUserById(id);
      setSelectedUser(data.data);
      setUserForm({
        name: data.data.name,
        email: data.data.email,
        password: "",
      });
      setActiveTab("edit");
    } catch (error) {
      showMessage("error", "Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.fetchProfile();
      setCurrentUser(data.data);
    } catch (error) {
      showMessage("error", "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setLoading(true);

      const updateData = {
        name: userForm.name,
        email: userForm.email,
      };

      if (userForm.password) {
        updateData.password = userForm.password;
      }

      const data = await userService.updateUser(selectedUser.id, updateData);

      showMessage("success", "User updated successfully!");
      setSelectedUser(data);
      fetchUsers();

      if (currentUser && currentUser.id === selectedUser.id) {
        fetchProfile();
      }
    } catch (error) {
      showMessage("error", error.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);

      const updateData = {
        name: userForm.name,
        email: userForm.email,
      };

      if (userForm.password) {
        updateData.password = userForm.password;
      }

      const data = await userService.updateProfile(updateData);

      showMessage("success", "Profile updated successfully!");
      setCurrentUser(data);
      setUserForm({
        name: data.name,
        email: data.email,
        password: "",
      });
    } catch (error) {
      showMessage("error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear auth token or user data
      localStorage.removeItem("token"); // adjust if you store elsewhere
      // Redirect to login page
      window.location.href = "/Auths";
    }
  };

  const deleteUser = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await userService.deleteUser(id);

      showMessage("success", "User deleted successfully!");
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser(null);
        setActiveTab("users");
      }
      fetchUsers();
    } catch (error) {
      showMessage("error", error.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const deleteAllUsers = async () => {
    if (
      !window.confirm(
        "⚠️ DANGER ZONE: This will delete ALL users except admins. This action cannot be undone. Are you absolutely sure?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await userService.deleteAllUsers();

      showMessage("success", "All users deleted successfully!");
      fetchUsers();
    } catch (error) {
      showMessage("error", error.message || "Failed to delete all users");
    } finally {
      setLoading(false);
    }
  };

  // Form handlers
  const handleFormChange = (field, value) => {
    setUserForm({
      ...userForm,
      [field]: value,
    });
  };

  const resetForm = () => {
    setUserForm({
      name: "",
      email: "",
      password: "",
    });
    setSelectedUser(null);
  };

  // Utility functions
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2) || "??"
    );
  };

  const getRoleBadgeClass = (role) => {
    return role === "admin"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Check if current user is admin
  const isAdmin = currentUser?.role === "admin";

  // Effects
  useEffect(() => {
    if (activeTab === "users" || activeTab === "edit") {
      fetchUsers();
    }
    if (activeTab === "profile") {
      fetchProfile();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage user accounts and profiles
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex flex-wrap gap-2">
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "users"
                ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("users")}
          >
            All Users
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
            onClick={() => {
              resetForm();
              setActiveTab("profile");
              if (currentUser) {
                setUserForm({
                  name: currentUser.name,
                  email: currentUser.email,
                  password: "",
                });
              }
            }}
          >
            My Profile
          </button>
          {selectedUser && activeTab === "edit" && (
            <button className="px-6 py-3 rounded-lg font-semibold bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md">
              Edit User
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Header with Filters */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Total: <strong>{pagination.totalUsers || 0}</strong>
                  </span>
                  {isAdmin && (
                    <button
                      onClick={deleteAllUsers}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={users.length === 0}
                    >
                      Delete All Users
                    </button>
                  )}
                </div>
              </div>

              {/* Users Table */}
              {loading ? (
                <div className="text-center py-8 text-gray-600">
                  Loading users...
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {getInitials(user.name)}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {user.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {user.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-medium">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(
                                  user.role
                                )}`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                              {user.phone || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => fetchUserById(user.id)}
                                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  disabled={
                                    !isAdmin && user.id !== currentUser?.id
                                  }
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteUser(user.id)}
                                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  disabled={
                                    !isAdmin || user.id === currentUser?.id
                                  }
                                  title={
                                    user.id === currentUser?.id
                                      ? "Cannot delete your own account"
                                      : ""
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Empty State */}
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-4xl mb-4">👥</div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        No users found
                      </h4>
                      <p className="text-gray-600 mb-4">
                        {searchTerm || roleFilter
                          ? "Try adjusting your search or filters"
                          : "No users in the system"}
                      </p>
                      {(searchTerm || roleFilter) && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setRoleFilter("");
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => fetchUsers(pagination.prevPage)}
                        disabled={!pagination.hasPrev}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600 font-medium">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchUsers(pagination.nextPage)}
                        disabled={!pagination.hasNext}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && currentUser && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">My Profile</h3>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeClass(
                    currentUser.role
                  )}`}
                >
                  {currentUser.role}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                    <div className="w-20 h-20 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {getInitials(currentUser.name)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {currentUser.name}
                      </h2>
                      <p className="text-blue-600 font-medium">
                        {currentUser.email}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Member since {formatDate(currentUser.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Account Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          User ID:
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {currentUser.id}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Email:
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {currentUser.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Phone:
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {currentUser.phone || "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Role:</span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(
                            currentUser.role
                          )}`}
                        >
                          {currentUser.role}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">
                          Last Updated:
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {formatDate(currentUser.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Update Profile
                  </h4>
                  <form
                    onSubmit={updateProfile}
                    className="space-y-4 text-gray-800"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                        required
                        placeholder="Enter your full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) =>
                          handleFormChange("email", e.target.value)
                        }
                        required
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) =>
                          handleFormChange("password", e.target.value)
                        }
                        placeholder="Leave blank to keep current password"
                        minLength="6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1 italic">
                        Minimum 6 characters. Leave empty to keep current
                        password.
                      </p>
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                      >
                        {loading ? "Updating..." : "Update Profile"}
                      </button>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                      >
                        Logout
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit User Tab */}
          {activeTab === "edit" && selectedUser && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  Edit User: {selectedUser.name}
                </h3>
                <button
                  onClick={() => setActiveTab("users")}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Users
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Info Card */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    User Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        User ID:
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {selectedUser.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Current Role:
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(
                          selectedUser.role
                        )}`}
                      >
                        {selectedUser.role}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <span className="text-gray-900 font-semibold">
                        {selectedUser.phone || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Joined:</span>
                      <span className="text-gray-900 font-semibold">
                        {formatDate(selectedUser.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">
                        Last Updated:
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {formatDate(selectedUser.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <form
                    onSubmit={updateUser}
                    className="space-y-4 text-gray-800"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                        required
                        placeholder="Enter user's full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) =>
                          handleFormChange("email", e.target.value)
                        }
                        required
                        placeholder="Enter user's email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) =>
                          handleFormChange("password", e.target.value)
                        }
                        placeholder="Leave blank to keep current password"
                        minLength="6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1 italic">
                        Minimum 6 characters. Leave empty to keep current
                        password.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                      >
                        {loading ? "Updating..." : "Update User"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(selectedUser.id)}
                        disabled={selectedUser.id === currentUser?.id}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title={
                          selectedUser.id === currentUser?.id
                            ? "Cannot delete your own account"
                            : ""
                        }
                      >
                        Delete User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
