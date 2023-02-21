'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('Videos', 'jitsi_meet_8x8_url',{ type: Sequelize.TEXT });
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('Videos', 'jitsi_meet_8x8_url');

  }
};
