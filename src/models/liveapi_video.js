'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LiveapiVideo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LiveapiVideo.init({
    _id: DataTypes.STRING,
    playback: DataTypes.JSON,
    download_url: DataTypes.JSON,
    user: DataTypes.STRING,
    environment: DataTypes.STRING,
    organization: DataTypes.STRING,
    media_info: DataTypes.JSON,
    creation_time: DataTypes.STRING,
    active: {
      type: DataTypes.STRING,
      defaultValue: true
    },
    deleted: {
      type: DataTypes.STRING,
      defaultValue: false
    },
    creation_time: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LiveapiVideo',
  });
  return LiveapiVideo;
};
