import React, { useState, useEffect } from "react";
import orderService from "../../services/order/orderService";

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [pagination, setPagination] = useState({
    totalOrders: 0,
    currentPage: 1,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  });

  // Form states
  const [createOrderForm, setCreateOrderForm] = useState({
    products: [{ productId: "", quantity: 1 }],
    total: "",
  });
  const [updateStatusForm, setUpdateStatusForm] = useState({
    status: "pending",
  });

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await orderService.getProducts();
        setAvailableProducts(products.data);
      } catch (error) {
        console.error("Failed to fetch productsdd", error);
      }
    };
    loadProducts();
  }, []);

  // Fetch orders
  const fetchOrders = async (page = 1, limit = 8) => {
    try {
      setLoading(true);
      const response = await orderService.fetchOrders(page, limit);
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showMessage("error", "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch order by ID
  const fetchOrderById = async (id) => {
    try {
      setLoading(true);
      const order = await orderService.fetchOrderById(id);
      setSelectedOrder(order.data);
      setActiveTab("details");
    } catch (error) {
      showMessage("error", "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };
  
  //create new order
  const createNewOrder = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Filter out invalid products
      const validProducts = createOrderForm.products.filter(
        (item) => item.productId && parseInt(item.quantity) > 0
      );

      if (validProducts.length === 0) {
        showMessage("error", "Please select at least one valid product.");
        return;
      }

      const orderData = {
        products: validProducts.map((item) => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
        })),
        total: validProducts
          .reduce((sum, item) => {
            const product = availableProducts.find(
              (p) => p.id === parseInt(item.productId)
            );
            return sum + (product ? product.price * item.quantity : 0);
          }, 0)
          .toFixed(2),
      };

      const response = await orderService.createOrder(orderData);

      showMessage("success", response.message || "Order created successfully!");
      setCreateOrderForm({
        products: [{ productId: "", quantity: 1 }],
        total: "",
      });
      fetchOrders();
    } catch (error) {
      console.error("Create Order Error:", error);
      showMessage(
        "error",
        error?.message ||
          error?.response?.data?.message ||
          "Failed to create order"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setLoading(true);
      const response = await orderService.updateOrderStatus(
        selectedOrder.id,
        updateStatusForm
      );
      showMessage("success", response.data.message);
      setSelectedOrder({ ...selectedOrder, status: updateStatusForm.status });
      fetchOrders();
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    )
      return;

    try {
      setLoading(true);
      const response = await orderService.deleteOrder(id);
      showMessage("success", response.data.message);
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(null);
        setActiveTab("orders");
      }
      fetchOrders();
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.message || "Failed to delete order"
      );
    } finally {
      setLoading(false);
    }
  };

  // Form helpers
  const addProductField = () => {
    setCreateOrderForm({
      ...createOrderForm,
      products: [...createOrderForm.products, { productId: "", quantity: 1 }],
    });
  };
  const removeProductField = (index) => {
    setCreateOrderForm({
      ...createOrderForm,
      products: createOrderForm.products.filter((_, i) => i !== index),
    });
  };
  const updateProductField = (index, field, value) => {
    const newProducts = [...createOrderForm.products];
    newProducts[index][field] = value;
    setCreateOrderForm({ ...createOrderForm, products: newProducts });
  };

  const calculateTotal = () => {
    return createOrderForm.products
      .reduce((sum, item) => {
        const product = availableProducts.find(
          (p) => p.id === parseInt(item.productId)
        );
        return sum + (product ? product.price * item.quantity : 0);
      }, 0)
      .toFixed(2);
  };

  // Utilities
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    }
  };
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="">
      <div className="text-center mb-8">
        <h1 className="text-slate-800 mb-2 text-4xl font-bold">
          Order Management
        </h1>
        <p className="text-slate-600 text-lg">
          Create, view, and manage your orders
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-lg mb-6 font-medium text-center ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex bg-white rounded-xl p-2 mb-8 shadow-md flex-wrap">
        <button
          className={`px-8 py-4 border-none bg-transparent text-slate-600 font-semibold rounded-lg cursor-pointer transition-all duration-300 m-1 ${
            activeTab === "orders"
              ? "bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
              : ""
          }`}
          onClick={() => {
            setActiveTab("orders");
            fetchOrders();
          }}
        >
          Orders
        </button>
        <button
          className={`px-8 py-4 border-none bg-transparent text-slate-600 font-semibold rounded-lg cursor-pointer transition-all duration-300 m-1 ${
            activeTab === "create"
              ? "bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
              : ""
          }`}
          onClick={() => setActiveTab("create")}
        >
          Create Order
        </button>
        {selectedOrder && (
          <button
            className={`px-8 py-4 border-none bg-transparent text-slate-600 font-semibold rounded-lg cursor-pointer transition-all duration-300 m-1 ${
              activeTab === "details"
                ? "bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                : ""
            }`}
            onClick={() => setActiveTab("details")}
          >
            Order Details
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        {activeTab === "orders" && (
          <div className="orders-section">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <h3 className="text-2xl font-bold text-slate-800">
                Order History
              </h3>
              <div className="flex gap-8">
                <span className="text-gray-500 text-sm">
                  Total Orders:{" "}
                  <strong className="text-slate-800">
                    {pagination?.totalOrders ?? 0}
                  </strong>
                </span>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500 italic">
                Loading orders...
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200 mb-8">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-gray-50 font-semibold text-slate-800 text-sm text-left border-b border-gray-200">
                          Order ID
                        </th>
                        <th className="px-4 py-3 bg-gray-50 font-semibold text-slate-800 text-sm text-left border-b border-gray-200">
                          Total Amount
                        </th>
                        <th className="px-4 py-3 bg-gray-50 font-semibold text-slate-800 text-sm text-left border-b border-gray-200">
                          Status
                        </th>
                        <th className="px-4 py-3 bg-gray-50 font-semibold text-slate-800 text-sm text-left border-b border-gray-200">
                          Date
                        </th>
                        <th className="px-4 py-3 bg-gray-50 font-semibold text-slate-800 text-sm text-left border-b border-gray-200">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b border-gray-200 font-mono text-blue-600">
                            <strong>#{order.orderId}</strong>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-semibold text-green-600">
                            ${parseFloat(order.totalAmount).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <span
                              className={`px-4 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeClass(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-gray-500 text-sm">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <div className="flex gap-2">
                              <button
                                onClick={() => fetchOrderById(order.orderId)}
                                className="bg-gray-600 text-white border-none px-3 py-1 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-700 text-sm"
                              >
                                View
                              </button>
                              <button
                                onClick={() => deleteOrder(order.orderId)}
                                className="bg-red-600 text-white border-none px-3 py-1 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-700 text-sm"
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

                {orders.length === 0 && (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <div className="text-5xl mb-4">📦</div>
                    <h4 className="text-gray-500 mb-2 text-xl">
                      No orders found
                    </h4>
                    <p className="mb-6">You haven't placed any orders yet.</p>
                    <button
                      onClick={() => setActiveTab("create")}
                      className="bg-linear-to-br from-blue-500 to-purple-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30"
                    >
                      Create Your First Order
                    </button>
                  </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => fetchOrders(pagination.prevPage)}
                      disabled={!pagination.hasPrev}
                      className="bg-gray-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Previous
                    </button>
                    <span className="text-gray-500 font-semibold">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => fetchOrders(pagination.nextPage)}
                      disabled={!pagination.hasNext}
                      className="bg-gray-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "create" && (
          <div className="create-order-section">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-800">
                Create New Order
              </h3>
              <p className="text-gray-600">
                Add products to create a new order
              </p>
            </div>

            <form
              onSubmit={createNewOrder}
              className="flex flex-col gap-8 text-gray-800"
            >
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-semibold text-slate-800">
                    Products
                  </h4>
                  <button
                    type="button"
                    onClick={addProductField}
                    className="bg-gray-600 text-white border-none px-3 py-1 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-700 text-sm"
                  >
                    + Add Product
                  </button>
                </div>

                {createOrderForm.products.map((product, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 items-end p-4 bg-white rounded-lg border border-gray-200 mb-4"
                  >
                    <div className="flex flex-col">
                      <label className="mb-2 text-slate-800 font-semibold text-sm">
                        Product
                      </label>
                      <select
                        value={product.productId}
                        onChange={(e) =>
                          updateProductField(index, "productId", e.target.value)
                        }
                        required
                        className="px-3 py-3 border border-gray-300 rounded-lg text-base transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10"
                      >
                        <option value="">Select a product</option>
                        {availableProducts.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.name} - ${prod.price}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-2 text-slate-800 font-semibold text-sm">
                        Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="quantitiy"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          updateProductField(index, "quantity", e.target.value)
                        }
                        required
                        className="px-3 py-3 border border-gray-300 rounded-lg text-base transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10"
                      />
                    </div>

                    <div className="flex items-center h-12">
                      {createOrderForm.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProductField(index)}
                          className="bg-red-600 text-white border-none px-3 py-1 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-gray-200">
                    Order Summary
                  </h4>
                  <div className="flex justify-between py-2 text-gray-500">
                    <span>Subtotal:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between py-2 text-gray-500">
                    <span>Shipping:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between py-4 mt-2 border-t border-gray-200 text-lg font-bold text-slate-800">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end flex-wrap">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-linear-to-br from-blue-500 to-purple-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? "Creating Order..." : "Create Order"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="bg-gray-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "details" && selectedOrder && (
          <div className="order-details-section">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">
                  Order #{selectedOrder.orderId}
                </h3>
                <p className="text-gray-600">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="bg-gray-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-700"
                >
                  Back to Orders
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-gray-200">
                  Order Information
                </h4>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Status:</span>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold capitalize ${getStatusBadgeClass(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">
                      Total Amount:
                    </span>
                    <span className="text-slate-800 font-semibold">
                      ${parseFloat(selectedOrder.totalAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">
                      Delivery Address:
                    </span>
                    <span className="text-slate-800">
                      {selectedOrder.deliveryAddress}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-gray-200">
                  Update Status
                </h4>
                <form
                  onSubmit={updateOrderStatus}
                  className="flex gap-4 items-end"
                >
                  <div className="flex-1">
                    <select
                      value={updateStatusForm.status}
                      onChange={(e) =>
                        setUpdateStatusForm({ status: e.target.value })
                      }
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-linear-to-br from-blue-500 to-purple-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? "Updating..." : "Update Status"}
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
              <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-gray-200">
                Order Items
              </h4>
              {selectedOrder.productDetails && (
                <div className="flex flex-col gap-3">
                  {JSON.parse(selectedOrder.productDetails).map(
                    (item, index) => {
                      const product = availableProducts.find(
                        (p) => p.id === item.productId
                      );
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200"
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">
                              {product?.name || `Product ${item.productId}`}
                            </span>
                            <span className="text-gray-500 text-sm">
                              ${product?.price || item.price} × {item.quantity}
                            </span>
                          </div>
                          <div className="font-semibold text-green-600">
                            $
                            {(
                              (product?.price || item.price) * item.quantity
                            ).toFixed(2)}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 border-l-4 border-l-red-500">
              <h4 className="text-red-600 text-lg font-semibold mb-4">
                Danger Zone
              </h4>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <p className="text-gray-500 flex-1">
                  Permanently delete this order. This action cannot be undone.
                </p>
                <button
                  onClick={() => deleteOrder(selectedOrder.id)}
                  className="bg-red-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-700"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
