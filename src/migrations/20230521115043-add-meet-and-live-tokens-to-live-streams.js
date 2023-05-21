'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('LiveStreams', 'meet_token', {
      type: Sequelize.STRING
    })

    await queryInterface.addColumn('LiveStreams', 'live_token', {
      type: Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('LiveStreams', 'meet_token')
    await queryInterface.removeColumn('LiveStreams', 'live_token')
  }
};
