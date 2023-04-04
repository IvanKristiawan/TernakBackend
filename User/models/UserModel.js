const { Sequelize } = require("sequelize");
const db = require("../../config/Database.js");
const Cabang = require("../../Master/models/Cabang/CabangModel.js");
const TutupPeriode = require("../../Accounting/TutupPeriode/models/TutupPeriodeModel.js");

const { DataTypes } = Sequelize;

const User = db.define(
  "users",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipeUser: {
      type: DataTypes.STRING,
      default: "ADMIN", // ADMIN, MANAGER, OWNER
      allowNull: true,
    },
    // Foreign Key Tutup Periode
    periodeId: {
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

User.belongsTo(Cabang, {
  foreignKey: "cabangId",
  targetKey: "id",
});

User.belongsTo(TutupPeriode, {
  foreignKey: "periodeId",
  targetKey: "id",
});

module.exports = User;

(async () => {
  await db.sync();
})();
