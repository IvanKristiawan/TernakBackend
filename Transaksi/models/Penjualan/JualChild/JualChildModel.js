const { Sequelize } = require("sequelize");
const db = require("../../../../config/Database.js");
const Jual = require("../../../models/Penjualan/Jual/JualModel.js");
const Stok = require("../../../../Master/models/Stok/StokModel.js");
const Customer = require("../../../../Master/models/Customer/CustomerModel.js");
const Cabang = require("../../../../Master/models/Cabang/CabangModel.js");

const { DataTypes } = Sequelize;

const JualChild = db.define(
  "jualchilds",
  {
    tanggalJual: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: true,
    },
    qtyJualChild: {
      type: DataTypes.INTEGER,
      default: 0,
      allowNull: false,
    },
    hargaJualChild: {
      type: DataTypes.INTEGER,
      default: 0,
      allowNull: false,
    },
    subtotalJualChild: {
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

    // Foreign Key Stok
    stokId: {
      type: DataTypes.INTEGER,
      default: 1,
      allowNull: false,
    },
    // Foreign Key Customer
    customerId: {
      type: DataTypes.INTEGER,
      default: 1,
      allowNull: false,
    },
    // Foreign Key Jual
    jualId: {
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

JualChild.belongsTo(Stok, {
  foreignKey: "stokId",
  targetKey: "id",
});

JualChild.belongsTo(Jual, {
  foreignKey: "jualId",
  targetKey: "id",
});

JualChild.belongsTo(Customer, {
  foreignKey: "customerId",
  targetKey: "id",
});

JualChild.belongsTo(Cabang, {
  foreignKey: "cabangId",
  targetKey: "id",
});

module.exports = JualChild;

(async () => {
  await db.sync();
})();
