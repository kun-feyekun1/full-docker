'use strict';

const mongoose = require('mongoose');
const faker = require('faker'); // npm install faker
require('dotenv').config();

const Notification = require('./models/Notification'); // adjust path if needed

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

async function generateNotifications(num = 50) {
  const notifications = [];

  for (let i = 0; i < num; i++) {
    notifications.push({
      title: faker.lorem.sentence(),
      message: faker.lorem.paragraph(),
      userId: faker.datatype.uuid(), // random userId; optional
      type: faker.helpers.arrayElement(['general', 'order', 'alert']),
      emailSent: faker.datatype.boolean(),
    });
  }

  return notifications;
}

async function seed() {
  try {
    // Optional: clear previous notifications
    await Notification.deleteMany({});
    console.log('Old notifications cleared');

    // Generate notifications
    const notifications = await generateNotifications(50);

    // Insert into DB
    await Notification.insertMany(notifications);
    console.log('Notifications seeded successfully');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
