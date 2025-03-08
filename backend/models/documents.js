const Sequelize = require("sequelize");
const db = require("../common/db");
const uuid = require("uuid");
const Folder = require("./folders");

const Document = db.define("documents", {
  id: {
    type: Sequelize.UUID,
    defaultValue: uuid.v4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  path: {
    type: Sequelize.STRING,
  },
  folder_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: Folder, // Explicitly linking Folder to Document
      key: "id",
    },
  },
  extension: {
    type: Sequelize.STRING,
  },
});

//  Define the relationship: A Folder has many Documents
Folder.hasMany(Document, { as: "documents", foreignKey: "folder_id" });
Document.belongsTo(Folder, { foreignKey: "folder_id" });

module.exports = Document;
