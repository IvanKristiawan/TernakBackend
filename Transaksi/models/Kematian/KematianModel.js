const { Sequelize } = require("sequelize");
const db = require("../../../config/Database.js");
const Stok = require("../../../Master/models/Stok/StokModel.js");
const Cabang = require("../../../Master/models/Cabang/CabangModel.js");

const { DataTypes } = Sequelize;

const Kematian = db.define(
    "kematians",
    {
        tanggalKematian: {
            type: DataTypes.DATE,
            defaultValue: new Date(),
            allowNull: true,
        },
        qtyKematian: {
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

Kematian.belongsTo(Stok, {
    foreignKey: "stokId",
    targetKey: "id",
});

Kematian.belongsTo(Cabang, {
    foreignKey: "cabangId",
    targetKey: "id",
});

module.exports = Kematian;

(async () => {
    await db.sync();
})();
