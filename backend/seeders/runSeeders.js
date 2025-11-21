'use strict';

const sequelizeSeeder = require('./postgresSeeder'); // your combined Postgres seeder
const mongoSeeder = require('./mongoSeeder');        // the MongoDB seeder
const db = require('../models');                     // your Sequelize models
const mongoose = require('mongoose');
require('dotenv').config();

async function runSeeders() {
  try {
    // ----------------------------
    // Connect to MongoDB
    // ----------------------------
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // ----------------------------
    // Run MongoDB seeder
    // ----------------------------
    await mongoSeeder();
    console.log('MongoDB seeder finished');

    // ----------------------------
    // Connect to Postgres and run Sequelize seeder
    // ----------------------------
    await db.sequelize.sync({ force: true }); // drops and recreates tables
    console.log('Postgres synced');

    await sequelizeSeeder();
    console.log('Postgres seeder finished');

    console.log('All seeders ran successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

runSeeders();
