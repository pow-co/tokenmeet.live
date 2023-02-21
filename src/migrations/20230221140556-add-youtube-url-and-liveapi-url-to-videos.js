'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('Videos', 'youtube_url',{ type: Sequelize.STRING });

    await queryInterface.addColumn('Videos', 'liveapi_url',{ type: Sequelize.STRING });

    await queryInterface.addColumn('Videos', 'url',{ type: Sequelize.STRING });

    await queryInterface.addColumn('Videos', 'startedAt',{ type: Sequelize.DATE });

    await queryInterface.addColumn('Videos', 'title',{ type: Sequelize.STRING });

    await queryInterface.addColumn('Videos', 'description',{ type: Sequelize.TEXT });

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('Videos', 'youtube_url');

    await queryInterface.removeColumn('Videos', 'liveapi_url');

    await queryInterface.removeColumn('Videos', 'url');

    await queryInterface.removeColumn('Videos', 'startedAt');

    await queryInterface.removeColumn('Videos', 'title');

    await queryInterface.removeColumn('Videos', 'description');

  }
};
