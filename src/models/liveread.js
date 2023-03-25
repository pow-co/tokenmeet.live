'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Liveread extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Liveread.init({
    txid: DataTypes.STRING,
    txix: DataTypes.INTEGER,
    txhex: DataTypes.TEXT,
    host: DataTypes.STRING,
    sponsor: DataTypes.STRING,
    commentary: DataTypes.TEXT,
    spent_method: DataTypes.STRING,
    spent_txid: DataTypes.STRING,
    spent_txix: DataTypes.INTEGER,
    version: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Liveread',
  });
  return Liveread;
};
