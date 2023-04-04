const { Sequelize } = require("sequelize");
const db = require("../../../../config/Database.js");
const Supplier = require("../../../../Master/models/Supplier/SupplierModel.js");
const Cabang = require("../../../../Master/models/Cabang/CabangModel.js");

const { DataTypes } = Sequelize;

const Beli = db.define(
  "belis",
  {
    noNotaBeli: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tanggalBeli: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: true,
    },
    totalBeli: {
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

    // Foreign Key Supplier
    supplierId: {
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

Beli.belongsTo(Cabang, {
  foreignKey: "cabangId",
  targetKey: "id",
});

Beli.belongsTo(Supplier, {
  foreignKey: "supplierId",
  targetKey: "id",
});

module.exports = Beli;

(async () => {
  await db.sync();
})();
