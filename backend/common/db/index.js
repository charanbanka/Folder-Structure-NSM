const Sequelize = require("sequelize");
const { dbconfig } = require("../config");

module.exports = new Sequelize(
  dbconfig.dbname,
  dbconfig.dbuser,
  dbconfig.dbpassword,
  {
    host: dbconfig.dbhost,
    port: dbconfig.dbport,
    dialect: "postgres",
    define: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);