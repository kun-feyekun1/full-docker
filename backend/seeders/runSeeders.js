

const sequelizeSeeder = require('./postgresSeeder');
const mongoSeeder = require('./mongoSeeder');
const db = require('../models');
const mongoose = require('mongoose');
require('dotenv').config();

async function runSeeders() {
  try {

    await mongoose.connect(process.env.MONGO_URL);
    console.log('Mongo connected');

    await mongoSeeder();
    console.log('Mongo seeder finished');

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
