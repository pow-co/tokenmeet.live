'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LiveapiVideos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      _id: {
        type: Sequelize.STRING
      },
      playback: {
        type: Sequelize.JSON
      },
      user: {
        type: Sequelize.STRING
      },
      download_url: {
        type: Sequelize.STRING
      },
      environment: {
        type: Sequelize.STRING
      },
      organization: {
        type: Sequelize.STRING
      },
      media_info: {
        type: Sequelize.JSON
      },
      creation_time: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('LiveapiVideos');
  }
};
