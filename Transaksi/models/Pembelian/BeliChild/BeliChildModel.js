const { Sequelize } = require("sequelize");
const db = require("../../../../config/Database.js");
const Beli = require("../../../models/Pembelian/Beli/BeliModel.js");
const Stok = require("../../../../Master/models/Stok/StokModel.js");
const Supplier = require("../../../../Master/models/Supplier/SupplierModel.js");
const Cabang = require("../../../../Master/models/Cabang/CabangModel.js");

const { DataTypes } = Sequelize;

const BeliChild = db.define(
  "belichilds",
  {
    tanggalBeli: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: true,
    },
    qtyBeliChild: {
      type: DataTypes.INTEGER,
      default: 0,
      allowNull: false,
    },
    hargaBeliChild: {
      type: DataTypes.INTEGER,
      default: 0,
      allowNull: false,
    },
    subtotalBeliChild: {
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
    // Foreign Key Beli
    beliId: {
      type: DataTypes.INTEGER,
      default: 1,
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

BeliChild.belongsTo(Stok, {
  foreignKey: "stokId",
  targetKey: "id",
});

BeliChild.belongsTo(Beli, {
  foreignKey: "beliId",
  targetKey: "id",
});

BeliChild.belongsTo(Cabang, {
  foreignKey: "cabangId",
  targetKey: "id",
});

BeliChild.belongsTo(Supplier, {
  foreignKey: "supplierId",
  targetKey: "id",
});

module.exports = BeliChild;

(async () => {
  await db.sync();
})();
