'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class log_trx_api extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  log_trx_api.init({
    user_id: DataTypes.STRING,
    api: DataTypes.STRING,
    request: DataTypes.TEXT,
    response: DataTypes.TEXT,
    insert_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'log_trx_api',
    tableName: 'log_trx_api',
    timestamps: false,
  });
  return log_trx_api;
};