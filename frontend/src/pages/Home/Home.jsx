// // import React from 'react';
// // import { useAnimation } from '../context/AnimationContext';
// // import { useAuth } from '../context/AuthContext';

// // const Home = () => {
// //   const { motion, slideUp, animated, useFadeSpring } = useAnimation();
// //   const { user } = useAuth();
// //   const fadeProps = useFadeSpring();

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <motion.div
// //         className="text-center mb-12"
// //         {...slideUp}
// //         transition={{ duration: 0.7 }}
// //       >
// //         <animated.h1
// //           className="text-5xl font-bold text-green-800 mb-4"
// //           style={fadeProps}
// //         >
// //           Connect Farmers to Markets
// //         </animated.h1>
// //         <p className="text-xl text-gray-600 mb-8">
// //           Direct market access for Ethiopian smallholder farmers
// //         </p>

// //         <motion.button
// //           className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
// //           whileHover={{ scale: 1.05 }}
// //           whileTap={{ scale: 0.95 }}
// //         >
// //           {user ? 'Go to Dashboard' : 'Get Started'}
// //         </motion.button>
// //       </motion.div>

// //       <motion.div
// //         className="grid md:grid-cols-3 gap-8"
// //         {...slideUp}
// //         transition={{ duration: 0.7, delay: 0.2 }}
// //       >
// //         <div className="bg-white p-6 rounded-lg shadow-md">
// //           <h3 className="text-xl font-semibold mb-3">📊 Real-time Prices</h3>
// //           <p>Access transparent market pricing across regions</p>
// //         </div>

// //         <div className="bg-white p-6 rounded-lg shadow-md">
// //           <h3 className="text-xl font-semibold mb-3">🤝 Direct Connections</h3>
// //           <p>Connect directly with verified buyers and suppliers</p>
// //         </div>

// //         <div className="bg-white p-6 rounded-lg shadow-md">
// //           <h3 className="text-xl font-semibold mb-3">📈 Sales Analytics</h3>
// //           <p>Track your sales and manage inventory efficiently</p>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // };

// // export default Home;

// // email.jsx
// import React, { useEffect, useState } from "react";

// /**
//  * Email & Notifications admin UI
//  *
//  * Usage:
//  *  - Place this file as email.jsx in your React app.
//  *  - Update API_BASE if your backend routes differ.
//  *  - No external deps required.
//  *
//  * Endpoints assumed (adjust API_BASE if different):
//  *  - POST   ${API_BASE}/emails/meeting-reminder
//  *  - POST   ${API_BASE}/emails/notify
//  *  - POST   ${API_BASE}/emails/order-confirmation
//  *  - GET    ${API_BASE}/notifications?page=1&limit=10
//  *  - GET    ${API_BASE}/notifications/:id
//  *  - PUT    ${API_BASE}/notifications/:id
//  *  - DELETE ${API_BASE}/notifications/:id
//  *  - POST   ${API_BASE}/notifications/delete-many?hard=true|false
//  *  - POST   ${API_BASE}/notifications/delete-all?hard=true|false
//  *
//  * Adjust these strings below if your routes are different.
//  */

// const API_BASE = "";
// // If your backend is mounted on the same origin, leave empty string.
// // Example if backend is at http://localhost:5000/api:
// // const API_BASE = "http://localhost:5000/api";

// const EMAIL_ENDPOINTS = {
//   meetingReminder: `${API_BASE}/api/emails/meeting-reminder`,
//   notify: `${API_BASE}/api/emails/notify`,
//   orderConfirmation: `${API_BASE}/api/emails/order-confirmation`,
// };

// const NOTIF_ENDPOINT = `${API_BASE}/api/notifications`;

// function Toast({ msg, type = "info", onClose }) {
//   if (!msg) return null;
//   const bg = type === "error" ? "#fdecea" : type === "success" ? "#ecfdf5" : "#eef2ff";
//   const border = type === "error" ? "#f5c2c7" : type === "success" ? "#bbf7d0" : "#c7d2fe";
//   return (
//     <div style={{
//       position: "fixed", right: 20, top: 20, minWidth: 260,
//       background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: 12, zIndex: 9999
//     }}>
//       <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
//         <div style={{ fontSize: 14 }}>{msg}</div>
//         <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer" }}>✕</button>
//       </div>
//     </div>
//   );
// }

// export default function EmailPage() {
//   // Data
//   const [notifications, setNotifications] = useState([]);
//   const [selectedIds, setSelectedIds] = useState(new Set());
//   const [selectAll, setSelectAll] = useState(false);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [pagination, setPagination] = useState(null);

//   // Loading / messages
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState({ msg: "", type: "info" });

//   // Modals / forms
//   const [viewing, setViewing] = useState(null); // notification object being viewed
//   const [editing, setEditing] = useState(null); // copy of notification for edit
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);

//   // Email forms
//   const [notifyForm, setNotifyForm] = useState({ to: "", subject: "", html: "" });
//   const [orderForm, setOrderForm] = useState({ userEmail: "", orderDetails: "" });

//   // Meeting reminder simple trigger
//   const [meetingReminderLoading, setMeetingReminderLoading] = useState(false);

//   // fetch notifications
//   useEffect(() => {
//     fetchNotifications(page, limit);
//     // eslint-disable-next-line
//   }, [page, limit]);

//   const showToast = (msg, type = "info", autoClose = 3000) => {
//     setToast({ msg, type });
//     if (autoClose) setTimeout(() => setToast({ msg: "", type: "info" }), autoClose);
//   };

//   async function fetchNotifications(pageNum = 1, lim = 10) {
//     try {
//       setLoading(true);
//       const url = `${NOTIF_ENDPOINT}?page=${pageNum}&limit=${lim}`;
//       const res = await fetch(url, { credentials: "include" });
//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(txt || `Failed to fetch notifications: ${res.status}`);
//       }
//       const data = await res.json();
//       setNotifications(Array.isArray(data.data) ? data.data : []);
//       setPagination(data.pagination || null);
//       setSelectedIds(new Set());
//       setSelectAll(false);
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Error fetching notifications", "error", 5000);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const toggleSelectOne = (id) => {
//     const s = new Set(selectedIds);
//     if (s.has(id)) s.delete(id); else s.add(id);
//     setSelectedIds(s);
//     setSelectAll(false);
//   };

//   const toggleSelectAll = () => {
//     if (selectAll) {
//       setSelectedIds(new Set());
//       setSelectAll(false);
//     } else {
//       const s = new Set(notifications.map(n => n._id || n.id));
//       setSelectedIds(s);
//       setSelectAll(true);
//     }
//   };

//   // View single
//   const loadNotificationById = async (id) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${NOTIF_ENDPOINT}/${id}`, { credentials: "include" });
//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(txt || "Failed to load notification");
//       }
//       const data = await res.json();
//       // controller returns { success: true, data: notification } or similar
//       const notif = data.data || data;
//       setViewing(notif);
//       setShowViewModal(true);
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Error loading notification", "error", 5000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Open edit modal with copy
//   const openEdit = (notif) => {
//     setEditing({ ...notif });
//     setShowEditModal(true);
//   };

//   const updateNotification = async () => {
//     try {
//       if (!editing || !editing._id) return showToast("No notification selected", "error");
//       setLoading(true);
//       const res = await fetch(`${NOTIF_ENDPOINT}/${editing._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(editing),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.message || "Failed to update");
//       showToast("Notification updated", "success");
//       setShowEditModal(false);
//       fetchNotifications(page, limit);
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Error updating", "error", 5000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete single (soft delete per controller)
//   const deleteNotification = async (id) => {
//     try {
//       if (!window.confirm("Delete this notification (soft delete)?")) return;
//       setLoading(true);
//       const res = await fetch(`${NOTIF_ENDPOINT}/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.message || "Failed to delete");
//       showToast("Notification soft-deleted", "success");
//       fetchNotifications(page, limit);
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Error deleting", "error", 5000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Bulk delete (soft by default, hard if query hard=true)
//   const bulkDelete = async (hard = false) => {
//     try {
//       if (selectedIds.size === 0) return showToast("No notifications selected", "error");
//       const ids = [...selectedIds];
//       const confirmMsg = hard
//         ? `Permanently delete ${ids.length} notifications? This cannot be undone.`
//         : `Soft-delete ${ids.length} notifications?`;
//       if (!window.confirm(confirmMsg)) return;
//       setLoading(true);
//       const url = `${NOTIF_ENDPOINT}/delete-many?hard=${hard ? "true" : "false"}`;
//       const res = await fetch(url, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ids }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.message || "Failed to delete many");
//       showToast(data?.message || "Bulk delete successful", "success");
//       setSelectedIds(new Set());
//       setSelectAll(false);
//       fetchNotifications(page, limit);
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Error bulk deleting", "error", 5000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete all (soft/hard)
//   const deleteAll = async (hard = false) => {
//     try {
//       const confirmMsg = hard
//         ? `Permanently delete ALL notifications? This cannot be undone.`
//         : `Soft-delete ALL notifications?`;
//       if (!window.confirm(confirmMsg)) return;
//       setLoading(true);
//       const url = `${NOTIF_ENDPOINT}/delete-all?hard=${hard ? "true" : "false"}`;
//       const res = await fetch(url, {
//         method: "POST",
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.message || "Failed to delete all");
//       showToast(data?.message || "Delete all successful", "success");
//       setSelectedIds(new Set());
//       setSelectAll(false);
//       fetchNotifications(1, limit);
//       setPage(1);
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Error deleting all", "error", 5000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Send meeting reminder
//   const sendMeetingReminder = async () => {
//     try {
//       if (!window.confirm("Send meeting reminder emails to all users?")) return;
//       setMeetingReminderLoading(true);
//       const res = await fetch(EMAIL_ENDPOINTS.meetingReminder, {
//         method: "POST",
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.message || "Failed to send meeting reminders");
//       showToast(data?.message || "Meeting reminders sent", "success");
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Error sending meeting reminders", "error", 5000);
//     } finally {
//       setMeetingReminderLoading(false);
//     }
//   };

//   // Send generic notification email
//   const sendNotificationEmail = async (e) => {
//     try {
//       e.preventDefault();
//       const { to, subject, html } = notifyForm;
//       if (!to || !subject || !html) return showToast("Fill all fields in notify form", "error");
//       setLoading(true);
//       const res = await fetch(EMAIL_ENDPOINTS.notify, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ to, subject, html }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.message || "Failed to send email");
//       showToast(data?.message || "Notification email sent", "success");
//       // Optionally add new notification returned by backend
//       if (data.notification) fetchNotifications(page, limit);
//       setNotifyForm({ to: "", subject: "", html: "" });
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Error sending notification email", "error", 5000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Send order confirmation
//   const sendOrderConfirmation = async (e) => {
//     try {
//       e.preventDefault();
//       const { userEmail, orderDetails } = orderForm;
//       if (!userEmail || !orderDetails) return showToast("Fill all fields in order form", "error");
//       setLoading(true);
//       const res = await fetch(EMAIL_ENDPOINTS.orderConfirmation, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userEmail, orderDetails }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.message || "Failed to send order confirmation");
//       showToast(data?.message || "Order confirmation sent", "success");
//       if (data.notification) fetchNotifications(page, limit);
//       setOrderForm({ userEmail: "", orderDetails: "" });
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Error sending order confirmation", "error", 5000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helpers
//   const formatDate = (v) => {
//     try {
//       return new Date(v).toLocaleString();
//     } catch (e) {
//       return v;
//     }
//   };

//   // Rendering
//   return (
//     <div style={{ padding: 20, fontFamily: "Inter, Roboto, sans-serif", maxWidth: 1200, margin: "0 auto" }}>
//       <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "" })} />

//       <h1 style={{ marginBottom: 8 }}>Emails & Notifications</h1>
//       <p style={{ color: "#555", marginTop: 0 }}>Frontend UI implementing your backend controller actions.</p>

//       <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
//         <div style={{ padding: 12, border: "1px solid #e6e6e6", borderRadius: 8 }}>
//           <h3>Send Meeting Reminder</h3>
//           <p style={{ fontSize: 13, color: "#444" }}>Triggers EmailService.sendNoticeEmailsForAll via backend.</p>
//           <button
//             onClick={sendMeetingReminder}
//             disabled={meetingReminderLoading}
//             style={{
//               marginTop: 8, padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer",
//               background: meetingReminderLoading ? "#ccc" : "#2563eb", color: "white"
//             }}>
//             {meetingReminderLoading ? "Sending..." : "Send Meeting Reminder to All"}
//           </button>
//         </div>

//         <div style={{ padding: 12, border: "1px solid #e6e6e6", borderRadius: 8 }}>
//           <h3>Send Notification Email</h3>
//           <form onSubmit={sendNotificationEmail}>
//             <div style={{ display: "grid", gap: 8 }}>
//               <input placeholder="To (email)" value={notifyForm.to} onChange={e => setNotifyForm({ ...notifyForm, to: e.target.value })} />
//               <input placeholder="Subject" value={notifyForm.subject} onChange={e => setNotifyForm({ ...notifyForm, subject: e.target.value })} />
//               <textarea placeholder="HTML body" value={notifyForm.html} onChange={e => setNotifyForm({ ...notifyForm, html: e.target.value })} rows={4} />
//               <div style={{ display: "flex", gap: 8 }}>
//                 <button type="submit" disabled={loading} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#16a34a", color: "white" }}>
//                   Send Notification Email
//                 </button>
//                 <button type="button" onClick={() => setNotifyForm({ to: "", subject: "", html: "" })} style={{ padding: "8px 12px" }}>
//                   Reset
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>

//         <div style={{ padding: 12, border: "1px solid #e6e6e6", borderRadius: 8 }}>
//           <h3>Send Order Confirmation</h3>
//           <form onSubmit={sendOrderConfirmation}>
//             <div style={{ display: "grid", gap: 8 }}>
//               <input placeholder="User email" value={orderForm.userEmail} onChange={e => setOrderForm({ ...orderForm, userEmail: e.target.value })} />
//               <textarea placeholder="Order details (JSON or text)" value={orderForm.orderDetails} onChange={e => setOrderForm({ ...orderForm, orderDetails: e.target.value })} rows={3} />
//               <div style={{ display: "flex", gap: 8 }}>
//                 <button type="submit" disabled={loading} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#0ea5e9", color: "white" }}>
//                   Send Order Confirmation
//                 </button>
//                 <button type="button" onClick={() => setOrderForm({ userEmail: "", orderDetails: "" })} style={{ padding: "8px 12px" }}>
//                   Reset
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>

//         <div style={{ padding: 12, border: "1px solid #e6e6e6", borderRadius: 8 }}>
//           <h3>Bulk Actions / Delete</h3>
//           <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//             <button onClick={() => bulkDelete(false)} style={{ padding: "8px 12px" }}>Soft-delete Selected</button>
//             <button onClick={() => bulkDelete(true)} style={{ padding: "8px 12px", background: "#ef4444", color: "white" }}>Hard-delete Selected</button>
//             <button onClick={() => deleteAll(false)} style={{ padding: "8px 12px" }}>Soft-delete All</button>
//             <button onClick={() => deleteAll(true)} style={{ padding: "8px 12px", background: "#ef4444", color: "white" }}>Hard-delete All</button>
//             <button onClick={() => fetchNotifications(page, limit)} style={{ padding: "8px 12px" }}>Refresh</button>
//           </div>
//           <div style={{ marginTop: 8, color: "#555" }}>
//             Selected: {selectedIds.size} • Showing page {page} • Limit {limit}
//           </div>
//         </div>
//       </section>

//       <section style={{ marginTop: 20, border: "1px solid #e6e6e6", borderRadius: 8, padding: 12 }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
//           <h2 style={{ margin: 0 }}>Notifications</h2>
//           <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//             <label>Per page:
//               <select value={limit} onChange={e => { setLimit(parseInt(e.target.value)); setPage(1); }} style={{ marginLeft: 6 }}>
//                 {[5,10,20,30,50].map(n => <option key={n} value={n}>{n}</option>)}
//               </select>
//             </label>
//             <button onClick={() => { setPage(p => Math.max(1, p - 1)); }} disabled={!pagination?.hasPrev}>Prev</button>
//             <button onClick={() => { if (pagination?.hasNext) setPage(p => p + 1); }} disabled={!pagination?.hasNext}>Next</button>
//           </div>
//         </div>

//         {loading ? <div>Loading...</div> : (
//           <>
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ textAlign: "left", borderBottom: "1px solid #e6e6e6" }}>
//                   <th style={{ padding: 8 }}>
//                     <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
//                   </th>
//                   <th style={{ padding: 8 }}>Title / Subject</th>
//                   <th style={{ padding: 8 }}>To</th>
//                   <th style={{ padding: 8 }}>Created</th>
//                   <th style={{ padding: 8 }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {notifications.length === 0 && (
//                   <tr><td colSpan={5} style={{ padding: 12 }}>No notifications found.</td></tr>
//                 )}
//                 {notifications.map((n) => {
//                   const id = n._id || n.id;
//                   return (
//                     <tr key={id} style={{ borderBottom: "1px solid #f0f0f0" }}>
//                       <td style={{ padding: 8 }}>
//                         <input type="checkbox" checked={selectedIds.has(id)} onChange={() => toggleSelectOne(id)} />
//                       </td>
//                       <td style={{ padding: 8 }}>
//                         <div style={{ fontWeight: 600 }}>{n.title || n.subject || (n.type ? `${n.type} notification` : "Notification")}</div>
//                         <div style={{ fontSize: 12, color: "#666" }}>{n.message || n.body || (n.html ? truncateHtml(n.html, 80) : "")}</div>
//                       </td>
//                       <td style={{ padding: 8 }}>{n.to || (n.recipient && displayRecipient(n.recipient)) || "-"}</td>
//                       <td style={{ padding: 8 }}>{formatDate(n.createdAt || n.created || n.date)}</td>
//                       <td style={{ padding: 8 }}>
//                         <div style={{ display: "flex", gap: 6 }}>
//                           <button onClick={() => loadNotificationById(id)}>View</button>
//                           <button onClick={() => openEdit(n)}>Edit</button>
//                           <button onClick={() => deleteNotification(id)} style={{ background: "#ef4444", color: "white" }}>Delete</button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>

//             <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <div style={{ color: "#555" }}>
//                 Page {pagination?.currentPage || page} • {pagination?.totalItems ?? 0} items • {pagination ? `${pagination.totalPages} pages` : ""}
//               </div>
//               <div>
//                 <button onClick={() => { setPage(1); fetchNotifications(1, limit); }}>Go to first</button>
//               </div>
//             </div>
//           </>
//         )}
//       </section>

//       {/* View modal */}
//       {showViewModal && viewing && (
//         <Modal title="View Notification" onClose={() => { setShowViewModal(false); setViewing(null); }}>
//           <div style={{ display: "grid", gap: 8 }}>
//             <div><strong>ID:</strong> {viewing._id || viewing.id}</div>
//             <div><strong>Subject:</strong> {viewing.subject || viewing.title}</div>
//             <div><strong>To:</strong> {viewing.to || viewing.recipient || "-"}</div>
//             <div><strong>Created:</strong> {formatDate(viewing.createdAt || viewing.created)}</div>
//             <div><strong>Body:</strong></div>
//             <div style={{ padding: 8, border: "1px solid #eee", borderRadius: 6, background: "#fafafa" }}>
//               <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{viewing.html || viewing.body || viewing.message || JSON.stringify(viewing, null, 2)}</pre>
//             </div>
//             <div style={{ display: "flex", gap: 8 }}>
//               <button onClick={() => { setShowViewModal(false); setViewing(null); openEdit(viewing); }}>Edit</button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Edit modal */}
//       {showEditModal && editing && (
//         <Modal title="Edit Notification" onClose={() => { setShowEditModal(false); setEditing(null); }}>
//           <div style={{ display: "grid", gap: 8 }}>
//             <label>Subject / Title
//               <input value={editing.subject || editing.title || ""} onChange={e => setEditing({ ...editing, subject: e.target.value, title: e.target.value })} />
//             </label>
//             <label>To
//               <input value={editing.to || editing.recipient || ""} onChange={e => setEditing({ ...editing, to: e.target.value, recipient: e.target.value })} />
//             </label>
//             <label>Body / HTML
//               <textarea rows={6} value={editing.html || editing.body || editing.message || ""} onChange={e => setEditing({ ...editing, html: e.target.value, body: e.target.value, message: e.target.value })} />
//             </label>
//             <div style={{ display: "flex", gap: 8 }}>
//               <button onClick={updateNotification}>Save</button>
//               <button onClick={() => { setShowEditModal(false); setEditing(null); }}>Cancel</button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// // Simple modal component
// function Modal({ title, children, onClose }) {
//   return (
//     <div style={{
//       position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
//       background: "rgba(0,0,0,0.3)", zIndex: 9998,
//     }}>
//       <div style={{ width: "min(880px, 94%)", background: "white", borderRadius: 10, padding: 16 }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
//           <h3 style={{ margin: 0 }}>{title}</h3>
//           <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: 18 }}>✕</button>
//         </div>
//         <div>{children}</div>
//       </div>
//     </div>
//   );
// }

// // helpers
// function truncateHtml(html = "", len = 100) {
//   const text = html.replace(/<\/?[^>]+(>|$)/g, "");
//   if (text.length <= len) return text;
//   return text.substring(0, len) + "...";
// }

// function displayRecipient(recipient) {
//   if (!recipient) return "-";
//   if (typeof recipient === "string") return recipient;
//   if (recipient.email) return recipient.email;
//   return JSON.stringify(recipient);
// }

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Star } from "lucide-react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Homepage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // GSAP Animations
  useEffect(() => {
    // Hero text animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll(".hero-text"),
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        }
      );
    }

    // Features animation
    if (featuresRef.current) {
      const features = featuresRef.current.querySelectorAll(".feature-item");

      gsap.fromTo(
        features,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Stats counter animation
    if (statsRef.current) {
      const stats = statsRef.current.querySelectorAll(".stat-number");

      stats.forEach((stat) => {
        const target = parseInt(stat.getAttribute("data-target"));
        const duration = 2;

        gsap.to(stat, {
          scrollTrigger: {
            trigger: stat,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
          innerText: target,
          duration: duration,
          snap: { innerText: 1 },
          ease: "power2.out",
          onUpdate: function () {
            stat.innerText = Math.ceil(this.targets()[0].innerText);
          },
        });
      });
    }
  }, []);

  const features = [
    {
      title: "Lightning Fast",
      description: "Optimized for speed with global CDN and advanced caching.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Enterprise Security",
      description:
        "Bank-level security with end-to-end encryption and compliance.",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Smart Analytics",
      description: "Real-time insights and predictive analytics dashboard.",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Cloud Native",
      description: "Built on scalable cloud infrastructure with 99.9% uptime.",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Developer First",
      description: "Comprehensive APIs, SDKs, and extensive documentation.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Mobile Ready",
      description: "Fully responsive with native mobile app experience.",
      color: "from-teal-500 to-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        {!user && (
          <div className="relative bg-amber-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div ref={heroRef}>
              {/* Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-8"
              >
                <Star className="w-4 h-4 mr-2 fill-current" />
                Trusted by All Ethiopians
              </motion.div>

              <motion.h1 className="hero-text text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6">
                Build The Future{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                  Faster
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p className="hero-text text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                The all-in-one platform that helps teams build, launch, and
                scale amazing products with unprecedented speed and efficiency.
              </motion.p>

              {/* Sign Up / Sign In Buttons */}
              <motion.div className="hero-text flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                {/* Sign In Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                  onClick={() => navigate("/Auths")}
                >
                  Sign In
                </motion.button>
                {/* Sign Up Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                  onClick={() => navigate("/Auths")}
                >
                  Sign Up <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help you build better products
              faster, with less effort.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-item group"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 h-full border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
