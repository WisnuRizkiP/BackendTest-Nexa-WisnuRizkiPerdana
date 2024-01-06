'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class karyawan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  karyawan.init({
    nip: DataTypes.STRING,
    nama: DataTypes.STRING,
    alamat: DataTypes.STRING,
    gend: DataTypes.ENUM('L', 'P'),
    photo: DataTypes.TEXT,
    tgl_lahir: DataTypes.DATE,
    status: DataTypes.INTEGER,
    insert_at: DataTypes.DATE,
    update_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'karyawan',
    tableName: 'karyawan',
    timestamps: false,
  });
  return karyawan;
};