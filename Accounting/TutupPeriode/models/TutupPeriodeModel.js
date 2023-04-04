const { Sequelize } = require("sequelize");
const db = require("../../../config/Database.js");
const Cabang = require("../../../Master/models/Cabang/CabangModel.js");

const { DataTypes } = Sequelize;

const TutupPeriode = db.define(
  "tutupperiodes",
  {
    namaPeriode: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    dariTanggal: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: true,
    },
    sampaiTanggal: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: true,
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

TutupPeriode.belongsTo(Cabang, {
  foreignKey: "cabangId",
  targetKey: "id",
});

module.exports = TutupPeriode;

(async () => {
  await db.sync();
})();
