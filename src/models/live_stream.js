'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LiveStream extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LiveStream.init({
    channel: DataTypes.STRING,
    meet_token: DataTypes.STRING,
    live_token: DataTypes.STRING,
    liveapi_data: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'LiveStream',
  });
  return LiveStream;
};
