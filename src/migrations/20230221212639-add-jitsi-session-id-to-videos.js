'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('Videos', 'jitsi_session_id', { type: Sequelize.STRING });
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('Videos', 'jitsi_session_id')
  }
};
