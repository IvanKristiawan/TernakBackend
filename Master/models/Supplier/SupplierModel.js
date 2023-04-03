const { Sequelize } = require("sequelize");
const db = require("../../../config/Database.js");

const { DataTypes } = Sequelize;

const Supplier = db.define(
  "suppliers",
  {
    kodeSupplier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    namaSupplier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamatSupplier: {
      type: DataTypes.STRING,
      default: "",
      allowNull: true,
    },
    kotaSupplier: {
      type: DataTypes.STRING,
      default: "",
      allowNull: true,
    },
    teleponSupplier: {
      type: DataTypes.STRING,
      default: "",
      allowNull: true,
    },
    npwpSupplier: {
      type: DataTypes.STRING,
      default: "",
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Supplier;

(async () => {
  await db.sync();
})();
