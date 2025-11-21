
'use strict'

require('dotenv').config();
const app = require('./App');
const connectToMongoDB = require("./config/mong");

const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

( async () => {
   try{
    await sequelize.authenticate();
    console.log('Database connected successfully!');

    await connectToMongoDB();

    const server = app.listen(PORT, () => {
        console.log(`Server running on port: http://localhost:${PORT}`);
    });

    const shutdown = async (signal) => {
        console.log(` ${signal} received. shutting down gracefully...`);
        server.close(async () => {
            console.log('Closing database connection...');
            await sequelize.close();
            console.log('Database connection closed.')
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (err) => {
       console.error('Uncaught Exception:', err.message);
       shutdown('uncaughtException');
    });

   }catch(err){
    console.error('Database connection failed:', err.message);
    process.exit(1);   
   }
})();
