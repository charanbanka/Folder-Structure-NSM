const Sequelize = require("sequelize");
const db = require("../common/db");
const uuid = require("uuid");

const Folder = db.define("folders", {
  id: {
    type: Sequelize.UUID,
    defaultValue: uuid.v4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  parent_id: {
    type: Sequelize.UUID,
    allowNull: true,
    references: {
      model: "folders", // Self-referencing relationship
      key: "id",
    },
  },
});


Folder.hasMany(Folder, { as: "children", foreignKey: "parent_id" });

module.exports = Folder;
