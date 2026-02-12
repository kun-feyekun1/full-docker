'use strict';

const connectToMongoDB = require('../config/mong');
const { faker } = require('@faker-js/faker');

const Notification = require('../mongoModels/Notification');

async function generateNotifications(num = 50) {
  const notifications = [];

  for (let i = 0; i < num; i++) {
    notifications.push({
      title: faker.lorem.sentence(),
      message: faker.lorem.paragraph(),
      userId: faker.string.uuid(),
      type: faker.helpers.arrayElement(['general', 'order', 'alert']),
      emailSent: faker.datatype.boolean(),
    });
  }

  return notifications;
}

async function mongoSeeder() {
  try {
    await connectToMongoDB();

    const count = await Notification.countDocuments();
    if (count > 0) {
      console.log('MongoDB already seeded. Skipping...');
    }

    // Generate notifications
    const notifications = await generateNotifications(50);

    // Insert into DB
    await Notification.insertMany(notifications);
    console.log('Notifications seeded successfully');

  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

module.exports = mongoSeeder;
