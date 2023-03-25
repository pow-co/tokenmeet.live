'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Livereads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      txid: {
        type: Sequelize.STRING
      },
      txix: {
        type: Sequelize.INTEGER
      },
      txhex: {
        type: Sequelize.TEXT
      },
      host: {
        type: Sequelize.STRING
      },
      sponsor: {
        type: Sequelize.STRING
      },
      commentary: {
        type: Sequelize.TEXT
      },
      spent_method: {
        type: Sequelize.STRING
      },
      spent_txid: {
        type: Sequelize.STRING
      },
      spent_txix: {
        type: Sequelize.INTEGER
      },
      version: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Livereads');
  }
};
