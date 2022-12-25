'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.addColumn('jaas_8x8_vc_events', 'txid', { type: Sequelize.STRING });

  },

  async down (queryInterface, Sequelize) {

     await queryInterface.removeColumn('jaas_8x8_vc_events', 'txid')
  }
};
