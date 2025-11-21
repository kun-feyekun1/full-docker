'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const faker = require('faker'); // npm install faker
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connect to your PostgreSQL database
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false,
});

// Import Models
const UserModel = require('./models/User')(sequelize, DataTypes);
const ProductModel = require('./models/Product')(sequelize, DataTypes);
const OrderModel = require('./models/Order')(sequelize, DataTypes);

// Associations
UserModel.hasMany(OrderModel, { foreignKey: 'userId' });
OrderModel.belongsTo(UserModel, { foreignKey: 'userId' });

// Product might be embedded in order as productDetails JSON
const User = UserModel;
const Product = ProductModel;
const Order = OrderModel;

// Helper function to hash passwords
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Generate fake Users
async function generateUsers(num = 50) {
  const users = [];
  for (let i = 0; i < num; i++) {
    const password = await hashPassword('password123');
    users.push({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password,
      phone: faker.phone.number('09########'),
      location: faker.address.city(),
      role: faker.helpers.arrayElement(['user', 'admin']),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return users;
}

// Generate fake Products
function generateProducts(num = 50) {
  const products = [];
  for (let i = 0; i < num; i++) {
    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(5, 500, 2),
      category: faker.commerce.department(),
      unit: faker.helpers.arrayElement(['kg', 'pcs', 'liter']),
      location: faker.address.city(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return products;
}

// Generate fake Orders
function generateOrders(users, products, num = 100) {
  const orders = [];
  for (let i = 0; i < num; i++) {
    const user = faker.helpers.arrayElement(users);
    const productCount = faker.datatype.number({ min: 1, max: 5 });
    const orderedProducts = faker.helpers.arrayElements(products, productCount);

    const productDetails = orderedProducts.map(p => ({
      id: p.id || null,
      name: p.name,
      quantity: faker.datatype.number({ min: 1, max: 10 }),
      price: p.price,
    }));

    const totalAmount = productDetails.reduce((sum, p) => sum + p.price * p.quantity, 0);

    orders.push({
      userId: user.id || null,
      productDetails: JSON.stringify(productDetails),
      totalAmount,
      deliveryAddress: faker.address.streetAddress(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return orders;
}

async function seed() {
  try {
    // Sync tables (drops and recreates)
    await sequelize.sync({ force: true });
    console.log('Tables synced');

    // Seed Users
    const usersData = await generateUsers(50);
    const createdUsers = await User.bulkCreate(usersData, { returning: true });
    console.log('Users seeded');

    // Seed Products
    const productsData = generateProducts(50);
    const createdProducts = await Product.bulkCreate(productsData, { returning: true });
    console.log('Products seeded');

    // Seed Orders
    const ordersData = generateOrders(createdUsers, createdProducts, 100);
    await Order.bulkCreate(ordersData);
    console.log('Orders seeded');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
