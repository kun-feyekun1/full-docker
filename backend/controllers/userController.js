const { User } = require("../models"); 
const redisClient = require("../config/redisClient.js");

const BASE = "users";

const createCacheKey = (suffix = "") => {
  return suffix ? `${BASE}:${suffix}` : BASE;
};

const getUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const queryKey = JSON.stringify({ ...req.query, page, limit })
    const CACHE_KEY = createCacheKey(`user:list:${Buffer.from(JSON.stringify(queryKey)).toString("base64")}`
    );

    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
      console.log("Serving users from cache");
      return res.json(JSON.parse(cached));
    }

    const { rows, count } = await User.findAndCountAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    const response = {
      pagination: {
        currentPage: page,
        limit,
        totalUsers: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
      data: rows,
    };

    await redisClient.setEx(CACHE_KEY, 30, JSON.stringify(response)); 
    console.log("Cached paginated users");

    res.json(response);

  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const CACHE_KEY = createCacheKey(`id:${id}`);

    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
      console.log(`Serving user ${id} from cache`);
      return res.json(JSON.parse(cached));
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Not found" });

    await redisClient.setEx(CACHE_KEY, 10, JSON.stringify(user));
    console.log(`Cached user ${id}`);
    res.json(user);

  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Not found" });

    await user.update({ 
      name, 
      email, 
      password });

    await redisClient.del(createCacheKey(`id:${id}`));
    await redisClient.del(createCacheKey());
    console.log(`Cache cleared for user ${id}`);
    res.json(user);

  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const CACHE_KEY = createCacheKey(`profile:${userId}`);

    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
      console.log(`Serving profile for user ${userId} from cache`);
      return res.json(JSON.parse(cached));
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await redisClient.setEx(CACHE_KEY, 10, JSON.stringify(user));
    console.log(`Cached profile for user ${userId}`);

    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Not found" });

    await user.destroy();

    await redisClient.del(createCacheKey(`id:${id}`));
    await redisClient.del(createCacheKey());
    console.log(`Cache cleared after deleting user ${id}`);
    res.json({ message: "Deleted successfully" });
    
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteAllUsers = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admin can delete all users." });
    }

    const deletedCount = await User.destroy({
      where: {},     
      truncate: true, 
    });

    await redisClient.del(createCacheKey());
    console.log("Cache cleared after deleting all users");

    res.status(200).json({ 
      message: `All users deleted successfully`, 
      deletedCount 
    });
  } catch (err) {
    console.error("Error deleting all users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { deleteUserById, deleteAllUsers, getProfile, updateUser, getUserById, getUsers };