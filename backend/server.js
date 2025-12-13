'use strict';

require('dotenv').config();
const app = require('./App');
const connectToMongoDB = require('./config/mong');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('SQL database connected successfully!');

    await connectToMongoDB();
    console.log('MongoDB connected successfully!');

    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await sequelize.close();
        console.log('Database connections closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      shutdown('unhandledRejection');
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      process.exit(1);
    });

  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
})();
