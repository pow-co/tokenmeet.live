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
    filepath: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Video',
  });
  return Video;
};
