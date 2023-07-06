const { Sequelize } = require("sequelize");
const db = require("../../config/Database.js");
const Cabang = require("../../Master/models/Cabang/CabangModel.js");

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

module.exports = User;

(async () => {
  await db.sync();
})();
