const Sequelize = require("sequelize");
const db = require("../db");
const uuid = require("uuid");

module.exports = db.define("users", {
  id: {
    type: Sequelize.UUID,
    defaultValue: function () {
      return uuid.v4();
    },
    primaryKey: true,
  },
  firstname: {
    type: Sequelize.STRING,
  },
  lastname: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  token: {
    type: Sequelize.STRING(2000),
  },
  ph_no: {
    type: Sequelize.STRING,
  },
  is_admin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  is_active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  is_deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});