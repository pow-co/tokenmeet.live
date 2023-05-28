'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   	await queryInterface.addColumn('ShowEpisodes', 'channel', { type: Sequelize.STRING });
   	await queryInterface.renameColumn('Shows', 'stub', 'channel')
  },

  async down (queryInterface, Sequelize) {
	  await queryInterface.removeColumn('ShowEpisodes', 'channel')
   	await queryInterface.renameColumn('Shows', 'channel', 'stub')
  }
};
