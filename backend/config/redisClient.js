
// config/redisClient.js
const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  url: process.env.RD_URL
});

// Event listeners
redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis error:", err));

// Connect the client immediately
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

module.exports = redisClient;
