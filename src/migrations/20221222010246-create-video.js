'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Videos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      event_id: {
        type: Sequelize.INTEGER
      },
      s3_url: {
        type: Sequelize.STRING
      },
      digital_ocean_url: {
        type: Sequelize.STRING
      },
      txid: {
        type: Sequelize.STRING
      },
      ipfs_hash: {
        type: Sequelize.STRING
      },
      uid: {
        type: Sequelize.STRING
      },
      filepath: {
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
    await queryInterface.dropTable('Videos');
  }
};
