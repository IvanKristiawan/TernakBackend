const { Sequelize } = require("sequelize");
const db = require("../../../config/Database.js");

const { DataTypes } = Sequelize;

const GroupStok = db.define(
  "groupstoks",
  {
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
