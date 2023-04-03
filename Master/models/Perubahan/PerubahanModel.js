const { Sequelize } = require("sequelize");
const db = require("../../../config/Database.js");

const { DataTypes } = Sequelize;

const Perubahan = db.define(
  "perubahans",
  {
    kodePerubahan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    namaPerubahan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Perubahan;

(async () => {
  await db.sync();
})();
