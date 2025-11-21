'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      orderId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: { 
      type: Sequelize.INTEGER, 
      allowNull: false 
    },      
      productDetails: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      totalAmount: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      deliveryAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};


//npx sequelize-cli model:generate --name Order --attributes userId:integer,orderId:INTEGER,productDetails:json,totalAmount:float,deliveryAddress:string