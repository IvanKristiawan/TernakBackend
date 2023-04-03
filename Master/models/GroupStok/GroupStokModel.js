const { Sequelize } = require("sequelize");
const db = require("../../../config/Database.js");

const { DataTypes } = Sequelize;

const GroupStok = db.define(
  "groupstoks",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    kodeGroupStok: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    namaGroupStok: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = GroupStok;

(async () => {
  await db.sync();
})();
