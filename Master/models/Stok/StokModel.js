const { Sequelize } = require("sequelize");
const db = require("../../../config/Database.js");
const GroupStok = require("../../models/GroupStok/GroupStokModel.js");

const { DataTypes } = Sequelize;

const Stok = db.define(
  "stoks",
  {
    namaStok: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qtyStok: {
      type: DataTypes.INTEGER,
      default: 0,
      allowNull: false,
    },

    // Foreign Key Group Stok
    groupStokId: {
      type: DataTypes.INTEGER,
      default: 1,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Stok.belongsTo(GroupStok, {
  foreignKey: "groupStokId",
  targetKey: "id",
});

module.exports = Stok;

(async () => {
  await db.sync();
})();
