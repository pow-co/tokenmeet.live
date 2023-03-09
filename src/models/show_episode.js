'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShowEpisode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ShowEpisode.init({
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    duration: DataTypes.NUMBER,
    participants: DataTypes.JSON,
    token_origin: DataTypes.STRING,
    hls_playback_url: DataTypes.STRING,
    hls_live_url: DataTypes.STRING,
    hls_playback_audio_url: DataTypes.STRING,
    hls_playback_embed_url: DataTypes.STRING,
    show_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ShowEpisode',
  });
  return ShowEpisode;
};
