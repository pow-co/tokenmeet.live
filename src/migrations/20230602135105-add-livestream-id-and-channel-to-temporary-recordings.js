'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('LiveapiTemporaryRecordings', 'livestream_id', { type: Sequelize.STRING })
    queryInterface.addColumn('LiveapiTemporaryRecordings', 'channel', { type: Sequelize.STRING })
  },

  async down (queryInterface, Sequelize) {

    queryInterace.removeColumn('LiveapiTemporaryRecordings', 'livestream_id')
    queryInterace.removeColumn('LiveapiTemporaryRecordings', 'channel')
  }
};
