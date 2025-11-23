require('dotenv').config();
const { Client } = require('pg');
const mongoose = require('mongoose');

(async () => {
  // -------------------------
  // Test Postgres
  // -------------------------
  try {
    if (!process.env.DB_URL) throw new Error('DB_URL is not defined in .env');
    
    const pg = new Client({ connectionString: process.env.DB_URL });
    await pg.connect();

    const res = await pg.query('SELECT * FROM "Users" LIMIT 5;');
    console.log('✅ Postgres Users:', res.rows);

    await pg.end();
  } catch (err) {
    console.error('❌ Postgres error:', err.message);
  }

  // -------------------------
  // Test Mongo
  // -------------------------
  try {
    if (!process.env.MONGO_URL) throw new Error('MONGO_URL is not defined in .env');

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection.db;

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('✅ Mongo collections:', collections.map(c => c.name));

    // Fetch and log all documents from each collection
    for (const col of collections) {
      const docs = await db.collection(col.name).find({}).toArray();
      console.log(`📄 Documents in "${col.name}":`, docs);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Mongo error:', err.message);
  }
})();
