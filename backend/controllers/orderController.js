
const { Order, Product} = require("../models");
const redisClient = require("../config/redisClient.js");
const { sendOrderConfirmation } = require("../services/emailService.js");

const BASE = "orders";

const createCacheKey = (suffix = "") => (suffix ? `${BASE}:${suffix}` : BASE);

const createOrder = async (req, res) => {
  try {
    const { products, total } = req.body;
    const userId = req.user.id;

    if (!products || !products.length) {
      return res.status(400).json({ message: "Order must contain at least one product" });
    }

    // check product availability
    for (const item of products) {
      const product = await Product.findByPk(item.productId);
      if (!product) return res.status(404).json({ message: `Product ID ${item.productId} not found` });
    }

    // Create order
    const order = await Order.create({
      userId,
      productDetails: JSON.stringify(products),
      totalAmount: total,
      deliveryAddress: "redisen"
    });

    // Clear cached order lists
    await redisClient.del(createCacheKey());
    await redisClient.del(createCacheKey(`user:${userId}`));

await sendOrderConfirmation({
  userEmail: req.user.email,
  userId: req.user.id,
  orderDetails: {
    id: order.id,      
    total,
    products,
  }
});


    res.status(201).json({ message: "Order created: ", order });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const queryKey = JSON.stringify({ ...req.query, page, limit });
    const CACHE_KEY = createCacheKey(`order:list:${Buffer.from(queryKey).toString("base64")}`
    );

    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
      console.log("Serving orders from cache");
      return res.json(JSON.parse(cached));
    }

    const { rows, count } = await Order.findAndCountAll({
      where: { userId },
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    const response = {
      pagination: {
        currentPage: page,
        limit,
        totalOrders: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
      data: rows,
    };

    await redisClient.setEx(CACHE_KEY, 60, JSON.stringify(response));
    console.log("Cached and served orders");

    res.json(response);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const CACHE_KEY = createCacheKey(`id:${id}`);

    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
      console.log(`Serving order ${id} from cache`);
      return res.json(JSON.parse(cached));
    }

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await redisClient.setEx(CACHE_KEY, 60, JSON.stringify(order));
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // pending, confirmed, shipped, delivered

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Optional: Only admin can change status
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied" });
    }

    await order.update({ status });

    // Invalidate cache
    await redisClient.del(createCacheKey(`id:${id}`));
    await redisClient.del(createCacheKey());

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Optional: Only admin or order owner can delete
    if (order.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await order.destroy();

    await redisClient.del(createCacheKey(`id:${id}`));
    await redisClient.del(createCacheKey());
    await redisClient.del(createCacheKey(`user:${req.user.id}`));

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder };