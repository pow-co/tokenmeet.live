'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.addColumn('Videos', 'liveapi_hls_url', { type: Sequelize.STRING });

     await queryInterface.addColumn('Videos', 'liveapi_embed_url', { type: Sequelize.STRING });
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.removeColumn('Videos', 'liveapi_hls_url');

     await queryInterface.removeColumn('Videos', 'liveapi_embed_url');

  }
};
