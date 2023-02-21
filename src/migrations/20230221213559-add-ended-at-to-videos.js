'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('Videos', 'endedAt',{ type: Sequelize.DATE });
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('Videos', 'endedAt');

  }
};
