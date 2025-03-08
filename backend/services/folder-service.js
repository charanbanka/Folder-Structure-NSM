const consts = require("../common/consts");
const FolderModel = require("../models/folders");
const DocumentModel = require("../models/documents");
const { raw } = require("body-parser");
const db = require("../common/db");

const failureResp = {
  status: consts.SERVICE_FAILURE,
  message: consts.GENERAL_ERROR_MESSAGE,
};

// Add Folder
const addFolderService = async (reqInfo) => {
  const funName = "addFolderService";
  try {
    let { name, description, parent_id } = reqInfo;

    if (!name) return { ...failureResp, message: "Name is Required!" };
    if (!description)
      return { ...failureResp, message: "Description is Required!" };

    console.log("auhdghfb", parent_id);

    await FolderModel.create({ name, description, parent_id });

    return { status: consts.SERVICE_SUCCESS };
  } catch (error) {
    console.error(`Error in ${funName}:`, error.message);
    return { status: consts.SERVICE_FAILURE, message: error.message };
  }
};

//Fetch a Single Folder by ID
const fetchFolderByIdService = async (id) => {
  const funName = "fetchFolderByIdService";
  try {
    if (!id) return { ...failureResp, message: "Id is Required!" };

    let folder = await FolderModel.findOne({ where: { id } });
    if (!folder) return { ...failureResp, message: "Folder not found!" };

    return { status: consts.SERVICE_SUCCESS, data: folder };
  } catch (error) {
    console.error(`Error in ${funName}:`, error.message);
    return { status: consts.SERVICE_FAILURE, message: error.message };
  }
};

// Fetch Folders (Parent or Child)
const fetchFoldersService = async (parent_id = null) => {
  const funName = "fetchFoldersService";
  try {
    let whereCondition = parent_id ? { parent_id } : {}; // 🔥 Fixes null condition

    let folders = await FolderModel.findAll({ where: whereCondition });

    return { status: consts.SERVICE_SUCCESS, data: folders };
  } catch (error) {
    console.error(`Error in ${funName}:`, error.message);
    return { status: consts.SERVICE_FAILURE, message: error.message };
  }
};

// Fetch Only Parent Folders
const fetchParentFoldersService = async () => {
  const funName = "fetchParentFoldersService";
  try {
    let folders = await FolderModel.findAll({ where: { parent_id: null } });

    return { status: consts.SERVICE_SUCCESS, data: folders };
  } catch (error) {
    console.error(`Error in ${funName}:`, error.message);
    return { status: consts.SERVICE_FAILURE, message: error.message };
  }
};

// Update Folder by ID
const updateFolderByIdService = async (reqInfo) => {
  const funName = "updateFolderByIdService";
  try {
    let { id, name, description } = reqInfo;

    if (!id) return { ...failureResp, message: "Id is Required!" };
    if (!name) return { ...failureResp, message: "Name is Required!" };
    if (!description)
      return { ...failureResp, message: "Description is Required!" };

    let updated = await FolderModel.update(
      { name, description },
      { where: { id } }
    );

    if (updated[0] === 0)
      return {
        ...failureResp,
        message: "Folder not found or no changes applied!",
      };

    return { status: consts.SERVICE_SUCCESS };
  } catch (error) {
    console.error(`Error in ${funName}:`, error.message);
    return { status: consts.SERVICE_FAILURE, message: error.message };
  }
};

// Delete Folder by ID
const deleteFolderByIdService = async (id) => {
  const funName = "deleteFolderByIdService";
  let transaction = await db.transaction();
  try {
    if (!id) return { ...failureResp, message: "Id is Required!" };

    await FolderModel.destroy({ where: { parent_id: id }, transaction });
    await DocumentModel.destroy({ where: { folder_id: id }, transaction });

    await FolderModel.destroy({ where: { id }, transaction });

    await transaction.commit();

    return { status: consts.SERVICE_SUCCESS };
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    console.error(`Error in ${funName}:`, error.message);
    return { status: consts.SERVICE_FAILURE, message: error.message };
  }
};

const fetchParentFoldersWithCounts = async () => {
  // const { parent_id } = reqInfo;
  try {
    let folders = await FolderModel.findAll({
      where: { parent_id: null }, // Fetch only top-level folders
      attributes: [
        "id",
        "name",
        "description",
        "created_at",
        "updated_at",
        [
          FolderModel.sequelize.literal(
            `(SELECT COUNT(*) FROM folders AS f WHERE f.parent_id = folders.id)`
          ),
          "subfolder_count",
        ],
        [
          FolderModel.sequelize.literal(
            `(SELECT COUNT(*) FROM documents AS d WHERE d.folder_id = folders.id)`
          ),
          "file_count",
        ],
      ],
    });

    return { status: "success", data: folders };
  } catch (error) {
    console.error("Error fetching parent folders:", error);
    return { status: "failure", message: error.message };
  }
};

const fetchFolderChildren = async (parent_id) => {
  try {
    let folders = await FolderModel.findAll({
      where: { parent_id },
      raw: true,
    });
    let documents = await DocumentModel.findAll({
      where: { folder_id: parent_id },
      raw: true,
    });

    let result = [];

    for (let item of folders) {
      let fd = await FolderModel.findAll({
        where: { id: item.id }, // Fetch only top-level folders
        attributes: [
          "id",
          "name",
          "description",
          "created_at",
          "updated_at",
          "parent_id",
          [
            FolderModel.sequelize.literal(
              `(SELECT COUNT(*) FROM folders AS f WHERE f.parent_id = folders.id)`
            ),
            "subfolder_count",
          ],
          [
            FolderModel.sequelize.literal(
              `(SELECT COUNT(*) FROM documents AS d WHERE d.folder_id = folders.id)`
            ),
            "file_count",
          ],
        ],
        raw: true,
      });
      result.push({ ...fd?.[0], isFolder: true });
    }

    let docs = documents.map((item) => {
      return { ...item, isFolder: false };
    });

    return { status: "success", data: [...result, ...docs] };
  } catch (error) {
    console.error("Error fetching child folders:", error);
    return { status: "failure", message: error.message };
  }
};

//  Export all functions
module.exports = {
  addFolderService,
  fetchFolderByIdService,
  fetchFoldersService,
  fetchParentFoldersService,
  updateFolderByIdService,
  deleteFolderByIdService,
  fetchParentFoldersWithCounts,
  fetchFolderChildren,
};
