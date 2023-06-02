'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('LiveapiTemporaryRecordings', 'convert_requested_at', { type: Sequelize.DATE })
    await queryInterface.addColumn('LiveapiTemporaryRecordings', 'convert_succeeded_at', { type: Sequelize.DATE })
    await queryInterface.addColumn('LiveapiTemporaryRecordings', 'convert_failed_at', { type: Sequelize.DATE })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('LiveapiTemporaryRecordings', 'convert_requested_at')
    await queryInterface.removeColumn('LiveapiTemporaryRecordings', 'convert_succeeded_at')
    await queryInterface.removeColumn('LiveapiTemporaryRecordings', 'convert_failed_at')
  }
};
