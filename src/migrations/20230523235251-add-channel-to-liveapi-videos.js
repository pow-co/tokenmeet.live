'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('LiveapiVideos', 'channel', { type: Sequelize.STRING });
    await queryInterface.addIndex('LiveapiVideos', ['channel']);
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('LiveapiVideos', 'channel')
    await queryInterface.removeIndex('LiveapiVideos', ['channel']);

  }
};
