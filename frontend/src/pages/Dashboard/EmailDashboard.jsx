import React, { useState, useEffect } from "react";
import emailService from "../../services/email/emailService";

const EmailDashboard = () => {
  const [activeTab, setActiveTab] = useState("send");
  const [loadingReminder, setLoadingReminder] = useState(false);
  const [loadingCustom, setLoadingCustom] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());

  // Form states
  const [sendEmailForm, setSendEmailForm] = useState({
    to: "",
    subject: "",
    html: "",
  });
  const [orderForm, setOrderForm] = useState({
    userEmail: "",
    orderDetails: { id: "", total: "", items: [] },
  });

  // Notification management
  const fetchNotifications = async (page = 1, limit = 8) => {
    try {
      setLoading(true);
      const data = await emailService.fetchNotifications(page, limit);
      setNotifications(data.data);
      setPagination(data.pagination);
    } catch {
      showMessage("error", "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationById = async (id) => {
    try {
      return await emailService.fetchNotificationById(id);
    } catch {
      showMessage("error", "Failed to fetch notification");
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?"))
      return;
    try {
      await emailService.deleteNotification(id);
      showMessage("success", "Notification deleted successfully");
      fetchNotifications();
    } catch {
      showMessage("error", "Failed to delete notification");
    }
  };

  const deleteMultipleNotifications = async (hardDelete = false) => {
    if (selectedNotifications.size === 0) {
      showMessage("error", "Please select notifications to delete");
      return;
    }

    const confirmMessage = hardDelete
      ? "This will permanently delete selected notifications. Continue?"
      : "Are you sure you want to delete selected notifications?";
    if (!window.confirm(confirmMessage)) return;

    try {
      await emailService.deleteMultipleNotifications(
        Array.from(selectedNotifications),
        hardDelete
      );
      showMessage(
        "success",
        `Notifications ${
          hardDelete ? "permanently deleted" : "soft-deleted"
        } successfully`
      );
      setSelectedNotifications(new Set());
      fetchNotifications();
    } catch {
      showMessage("error", "Failed to delete notifications");
    }
  };

  const deleteAllNotifications = async (hardDelete = false) => {
    const confirmMessage = hardDelete
      ? "This will permanently delete ALL notifications. This action cannot be undone. Continue?"
      : "Are you sure you want to delete all notifications?";
    if (!window.confirm(confirmMessage)) return;

    try {
      await emailService.deleteAllNotifications(hardDelete);
      showMessage(
        "success",
        `All notifications ${
          hardDelete ? "permanently deleted" : "soft-deleted"
        }`
      );
      fetchNotifications();
    } catch {
      showMessage("error", "Failed to delete all notifications");
    }
  };

  // Email sending functions
  const sendMeetingReminder = async () => {
    try {
      setLoadingReminder(true);
      const data = await emailService.sendMeetingReminder();
      showMessage("success", data.message);
    } catch (error) {
      showMessage(
        "error",
        error?.message || "Failed to send meeting reminders"
      );
    } finally {
      setLoadingReminder(false);
    }
  };

  const sendCustomEmail = async (e) => {
    e.preventDefault();
    try {
      setLoadingCustom(true);
      const data = await emailService.sendCustomEmail(sendEmailForm);
      showMessage("success", data.message);
      setSendEmailForm({ to: "", subject: "", html: "" });
    } catch (error) {
      showMessage("error", error?.message || "Failed to send email");
    } finally {
      setLoadingCustom(false);
    }
  };

  const sendOrderConfirmation = async (e) => {
    e.preventDefault();
    try {
      setLoadingOrder(true);
      const data = await emailService.sendOrderConfirmation(orderForm);
      showMessage("success", data.message);
      setOrderForm({
        userEmail: "",
        orderDetails: { id: "", total: "", items: [] },
      });
    } catch (error) {
      showMessage(
        "error",
        error?.message || "Failed to send order confirmation"
      );
    } finally {
      setLoadingOrder(false);
    }
  };

  // Utility functions
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const toggleNotificationSelection = (id) => {
    const newSelection = new Set(selectedNotifications);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedNotifications(newSelection);
  };

  const selectAllNotifications = () => {
    if (selectedNotifications.size === notifications.length)
      setSelectedNotifications(new Set());
    else setSelectedNotifications(new Set(notifications.map((n) => n._id)));
  };

  // Effects
  useEffect(() => {
    if (activeTab === "notifications") fetchNotifications();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email & Notification Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage email campaigns and system notifications
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
        <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex flex-col sm:flex-row gap-2">
          <button
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "send"
                ? " bg-linear-to-r from-yellow-600 to-green-600 text-white font-semibold rounded-lg hover:from-blue-400 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                : "text-gray-600 hover:text-white hover:bg-gray-100"
                     

            }`}
            onClick={() => setActiveTab("send")}
          >
            Send Emails
          </button>
          <button
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "notifications"
                ? " bg-linear-to-r from-yellow-600 to-green-600 text-white font-semibold rounded-lg hover:from-blue-400 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                : "text-gray-600 hover:text-white hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveTab("notifications");
              fetchNotifications();
            }}
          >
            Notifications
          </button>
        </div>

        {/* Tab Content */}
        <div className="rounded-xl shadow-sm p-6">
          {/* Send Email Tab */}
          {activeTab === "send" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Meeting Reminders Card */}
                <div className="flex flex-col bg-gray-50 p-6 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Meeting Reminders
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Send meeting reminder emails to all registered users
                  </p>
                  <button
                    onClick={sendMeetingReminder}
                    disabled={loadingReminder}
                    className=" mt-auto w-full px-4 py-3 bg-linear-to-r from-yellow-600 to-green-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {loadingReminder ? "Sending..." : "Send Meeting Reminders"}
                  </button>
                </div>

                {/* Custom Email Card */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Custom Email
                  </h3>
                  <form onSubmit={sendCustomEmail} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Email
                      </label>

                      <input
                        type="email"
                        value={sendEmailForm.to}
                        onChange={(e) =>
                          setSendEmailForm({
                            ...sendEmailForm,
                            to: e.target.value,
                          })
                        }
                        required
                        placeholder="recipient@agrico.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                      />

                      <textarea
                        value={sendEmailForm.html}
                        onChange={(e) =>
                          setSendEmailForm({
                            ...sendEmailForm,
                            html: e.target.value,
                          })
                        }
                        required
                        placeholder="HTML email content"
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors resize-vertical"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={sendEmailForm.subject}
                        onChange={(e) =>
                          setSendEmailForm({
                            ...sendEmailForm,
                            subject: e.target.value,
                          })
                        }
                        required
                        placeholder="Email subject"
                        className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loadingCustom}
                      className=" mt-auto w-full px-4 py-3 bg-linear-to-r from-yellow-600 to-green-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {loadingCustom ? "Sending..." : "Send Custom Email"}
                    </button>
                  </form>
                </div>

                <div className="flex flex-col flex-1 bg-gray-50 p-6 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Order Confirmation
                  </h3>

                  <form
                    onSubmit={sendOrderConfirmation}
                    className="flex flex-col h-full space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Email
                      </label>
                      <input
                        type="email"
                        value={orderForm.userEmail}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            userEmail: e.target.value,
                          })
                        }
                        required
                        placeholder="customer@example.com"
                        className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order ID
                      </label>
                      <input
                        type="text"
                        value={orderForm.orderDetails.id}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            orderDetails: {
                              ...orderForm.orderDetails,
                              id: e.target.value,
                            },
                          })
                        }
                        required
                        placeholder="ORD-12345"
                        className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Total
                      </label>
                      <input
                        type="number"
                        value={orderForm.orderDetails.total}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            orderDetails: {
                              ...orderForm.orderDetails,
                              total: e.target.value,
                            },
                          })
                        }
                        required
                        placeholder="$99.99"
                        step="0.5"
                        min={1}
                        className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loadingOrder}
                      className=" mt-auto w-full px-4 py-3 bg-linear-to-r from-yellow-600 to-green-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {loadingOrder ? "Sending..." : "Send Order Confirmation"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              {/* Header with Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  System Notifications
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => deleteMultipleNotifications(false)}
                    disabled={selectedNotifications.size === 0}
                    className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete Selected ({selectedNotifications.size})
                  </button>
                  <button
                    onClick={() => deleteAllNotifications(false)}
                    disabled={notifications.length === 0}
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete All
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-600">
                  Loading notifications...
                </div>
              ) : (
                <>
                  {/* Notifications Table */}
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={
                                selectedNotifications.size ===
                                  notifications.length &&
                                notifications.length > 0
                              }
                              onChange={selectAllNotifications}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email Sent
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {notifications.map((notification) => (
                          <tr
                            key={notification._id}
                            className={`hover:bg-gray-50 transition-colors ${
                              notification.deleted
                                ? "opacity-60 bg-yellow-50"
                                : ""
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedNotifications.has(
                                  notification._id
                                )}
                                onChange={() =>
                                  toggleNotificationSelection(notification._id)
                                }
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                              <div className="font-semibold text-gray-900">
                                {notification.title}
                              </div>
                              <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                                {notification.message?.substring(0, 100)}...
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  notification.type === "general"
                                    ? "bg-green-100 text-green-800"
                                    : notification.type === "alert"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {notification.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  notification.emailSent
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {notification.emailSent ? "✓ Sent" : "✗ Failed"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() =>
                                  deleteNotification(notification._id)
                                }
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Empty State */}
                  {notifications.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-gray-500">
                        No notifications found
                      </div>
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={() =>
                          fetchNotifications(pagination.currentPage - 1)
                        }
                        disabled={!pagination.hasPrev}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600 font-medium">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() =>
                          fetchNotifications(pagination.currentPage + 1)
                        }
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
        </div>
      </div>
    </div>
  );
};

export default EmailDashboard;
