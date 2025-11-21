// resetSequence.js
const { sequelize } = require('./models'); // your Sequelize instance

async function resetSequence(tableName, idColumn = 'id', startValue = 1) {
  try {
    const sequenceName = `"${tableName}_${idColumn}_seq"`; // Postgres default naming
    await sequelize.query(`ALTER SEQUENCE ${sequenceName} RESTART WITH ${startValue};`);
    console.log(`Sequence for ${tableName} reset to start at ${startValue}`);
  } catch (err) {
    console.error('Error resetting sequence:', err);
  }
}

module.exports = resetSequence;

