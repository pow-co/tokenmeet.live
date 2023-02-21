'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Video.init({
    event_id: DataTypes.INTEGER,
    s3_url: DataTypes.STRING,
    digital_ocean_url: DataTypes.STRING,
    txid: DataTypes.STRING,
    ipfs_hash: DataTypes.STRING,
    uid: DataTypes.STRING,
    url: DataTypes.STRING,
    youtube_url: DataTypes.STRING,
    liveapi_url: DataTypes.STRING,
    filepath: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    startedAt: DataTypes.DATE,
    endedAt: DataTypes.DATE,
    jitsi_session_id: DataTypes.STRING,
    jitsi_meet_8x8_url: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Video',
  });
  return Video;
};
