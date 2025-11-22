
const redisClient = require("../config/redisClient.js");
const { Product } = require("../models");

const BASE = "products";

const createCacheKey = (suffix = "") => {
  return suffix ? `${BASE}:${suffix}` : BASE;
};

const getProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const queryKey = JSON.stringify({ ...req.query, page, limit });
    const CACHE_KEY = createCacheKey(`product:list:${Buffer.from(queryKey).toString("base64")}`
    );

    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
      console.log("Serving products from cache");
      return res.json(JSON.parse(cached));
    }

    const { rows, count } = await Product.findAndCountAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    const response = {
      pagination: {
        currentPage: page,
        limit,
        totalProducts: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
      data: rows,
    };

    await redisClient.setEx(CACHE_KEY, 60, JSON.stringify(response)); // 60s cache
    console.log("Cached and served products");

    res.json(response);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const CACHE_KEY = createCacheKey(`id:${id}`);

    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
      console.log(`Serving product ${id} from cache`);
      return res.json(JSON.parse(cached));
    }

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Not found" });

    await redisClient.setEx(CACHE_KEY, 100, JSON.stringify(product)); 
    console.log(`Cached product ${id}`);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, unit, location } = req.body;
    const product = await Product.create({ name, price, description, category, unit, location  });

    await redisClient.del(createCacheKey()); 
    console.log("Cache cleared after product creation");
    res.status(201).json(product);

  } catch (err) {
    console.error(err);
       console.log('what the hell is going on!')
    res.status(500).json({ message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Not found" });

    await product.update({ name, price, description });

    await redisClient.del(createCacheKey(`id:${id}`));
    await redisClient.del(createCacheKey()); 
    console.log(`Cache cleared for product ${id}`);
    res.json(product);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Not found" });

    await product.destroy();

    await redisClient.del(createCacheKey(`id:${id}`));
    await redisClient.del(createCacheKey());
    console.log(`Cache cleared after deleting product ${id}`);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };