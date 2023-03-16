'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LiveapiTemporaryRecording extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LiveapiTemporaryRecording.init({
    _id: DataTypes.STRING,
    stream_key: DataTypes.STRING,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    export_data: DataTypes.JSON,
    duration: DataTypes.INTEGER,
    playback: DataTypes.JSON,
    download_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LiveapiTemporaryRecording',
  });
  return LiveapiTemporaryRecording;
};