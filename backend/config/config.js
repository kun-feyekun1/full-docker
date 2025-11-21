require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        url: process.env.DB_URL,
        port: process.env.PORT,
        dialect: 'postgres'
    }
};

module.exports = config[env];