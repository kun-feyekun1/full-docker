
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken") ;
const { User } = require("../models");
const messageToFriends = require('../utils/emailMessages/meetingReminder');
const { sendLoginNotificationEmail } = require('../services/emailService')  

const JWT_SECRET = process.env.JWT_TOKEN_SECRET;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRES_IN;

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
       name, 
       email, 
       password: hashedPassword, 
       phone });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
      token,
    });

  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    await sendLoginNotificationEmail({
          to: user.email,
          subject: `Login Alert for ${user.name}`,
          text: `Hello ${user.name}, : You just logged in at ${new Date().toLocaleString()}.`,
          html: messageToFriends,
          userId: user.id,
      });

     return res.json({ message: "Login successful", token });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


const logout = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) return res.status(400).json({ message: "Invalid request" });

    console.log(`User ${userId} logged out!`);
    res.json({ message: "Logged out successfully" });

  } catch (err) {
    console.error("Error in logout:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { register, login, logout };
