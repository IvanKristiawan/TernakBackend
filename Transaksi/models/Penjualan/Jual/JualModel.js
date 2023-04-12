const { Sequelize } = require("sequelize");
const db = require("../../../../config/Database.js");
const Customer = require("../../../../Master/models/Customer/CustomerModel.js");
const Cabang = require("../../../../Master/models/Cabang/CabangModel.js");

const { DataTypes } = Sequelize;

const Jual = db.define(
  "juals",
  {
    noNotaJual: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tanggalJual: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: true,
    },
    totalJual: {
      type: DataTypes.INTEGER,
      default: 0,
      allowNull: false,
    },

    userIdInput: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userIdUpdate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // isPost
    isPost: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    // Foreign Key Customer
    customerId: {
      type: DataTypes.INTEGER,
      default: 1,
      allowNull: false,
    },
    // Foreign Key Cabang
    cabangId: {
      type: DataTypes.STRING,
      default: "001",
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Jual.belongsTo(Cabang, {
  foreignKey: "cabangId",
  targetKey: "id",
});

Jual.belongsTo(Customer, {
  foreignKey: "customerId",
  targetKey: "id",
});

module.exports = Jual;

(async () => {
  await db.sync();
})();
