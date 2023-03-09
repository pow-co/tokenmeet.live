'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShowEpisodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      duration: {
        type: Sequelize.INTEGER
      },
      participants: {
        type: Sequelize.JSON
      },
      token_origin: {
        type: Sequelize.STRING
      },
      hls_playback_url: {
        type: Sequelize.STRING
      },
      hls_live_url: {
        type: Sequelize.STRING
      },
      hls_playback_audio_url: {
        type: Sequelize.STRING
      },
      hls_playback_embed_url: {
        type: Sequelize.STRING
      },
      show_id: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('ShowEpisodes');
  }
};
