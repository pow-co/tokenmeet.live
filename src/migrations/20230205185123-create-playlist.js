"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Videos", "playlist_id", {
      type: Sequelize.STRING,
    });

    await queryInterface.createTable("Playlists", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      owner_paymail: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      stub: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Videos", "playlist_id");
    await queryInterface.dropTable("Playlists");
  },
};
