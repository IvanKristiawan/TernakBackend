const { Sequelize } = require("sequelize");
const db = require("../../../config/Database.js");

const { DataTypes } = Sequelize;

const Customer = db.define(
  "customers",
  {
    kodeCustomer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    namaCustomer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamatCustomer: {
      type: DataTypes.STRING,
      default: "",
      allowNull: true,
    },
    kotaCustomer: {
      type: DataTypes.STRING,
      default: "",
      allowNull: true,
    },
    noTelpCustomer: {
      type: DataTypes.STRING,
      default: "",
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Customer;

(async () => {
  await db.sync();
})();
