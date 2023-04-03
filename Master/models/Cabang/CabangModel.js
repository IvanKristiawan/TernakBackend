const { Sequelize } = require("sequelize");
const db = require("../../../config/Database.js");

const { DataTypes } = Sequelize;

const Cabang = db.define(
  "cabangs",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    namaCabang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamatCabang: {
      type: DataTypes.STRING,
      default: "",
      allowNull: true,
    },
    teleponCabang: {
      type: DataTypes.STRING,
      default: "",
      allowNull: true,
    },
    picCabang: {
      type: DataTypes.STRING,
      default: "",
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Cabang;

(async () => {
  await db.sync();
})();
