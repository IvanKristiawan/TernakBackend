const { Sequelize } = require("sequelize");

// Connect PhpMyAdmin MySql to Nodejs
const db = new Sequelize("ternak_lele", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// Akun MySql Hosting
// const db = new Sequelize("n1578302_ternak_lele", "n1578302_ivan", "Damnfly*369", {
//   host: "127.0.0.1",
//   dialect: "mysql",
// });

module.exports = db;
