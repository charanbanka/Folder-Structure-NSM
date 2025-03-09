const consts = require("../common/consts");
const FolderModel = require("../models/folders");
const DocumentModel = require("../models/documents");
const db = require("../common/db");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

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

const fetchParentFoldersWithCounts = async (reqInfo) => {
  const { name, description, date } = reqInfo;
  try {
    if (name || description || date)
      return await fetchFoldersWithCountsByFilter(reqInfo);

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
          "doc_count",
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
            "doc_count",
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

const fetchFoldersAndDocsCountService = async () => {
  const funName = "fetchFoldersAndDocsCountService";
  try {
    // Get total count of folders
    const foldersCount = await FolderModel.count();

    // Get total count of documents
    const docsCount = await DocumentModel.count();

    return {
      status: consts.SERVICE_SUCCESS,
      data: {
        docs_count: docsCount,
        folders_count: foldersCount,
      },
    };
  } catch (error) {
    console.error(`Error in ${funName}:`, error.message);
    return { status: consts.SERVICE_FAILURE, message: error.message };
  }
};

/**
 * Fetches folders with their subfolder and document counts based on specified filters.
 * @param {Object} filterCriteria - Filter criteria including name, description, and date.
 * @returns {Object} - Response object with status and folder data or error message.
 */
const fetchFoldersWithCountsByFilter = async (filterCriteria = {}) => {
  const { name, description, date } = filterCriteria;

  try {
    // Fetch matching folders with basic attributes
    const matchingFolders = await FolderModel.findAll({
      where: {
        ...(name && {
          name: {
            [Sequelize.fn("LOWER", Sequelize.col("name"))]: {
              [Op.like]: `%${name.toLowerCase()}%`,
            },
          },
        }),
        ...(description && { description: { [Op.like]: `%${description}%` } }),
        ...(date && { created_at: date }),
      },
      attributes: ["id", "name", "parent_id"],
    });
    console.log("Matching folders:", matchingFolders);

    // Fetch matching documents with basic attributes
    const matchingDocuments = await DocumentModel.findAll({
      where: {
        ...(name && { name: { [Op.like]: `%${name}%` } }),
        ...(date && { created_at: date }),
      },
      attributes: ["id", "name", "folder_id"],
    });
    console.log("Matching documents:", matchingDocuments);

    // Collect unique folder IDs for recursive parent fetching
    const folderIdSet = new Set();
    const topLevelFolderIds = [];

    // Identify top-level folders and collect parent IDs
    for (const folder of matchingFolders) {
      if (folder.id && folder.parent_id === null) {
        topLevelFolderIds.push(folder.id);
      } else if (folder.id && folder.parent_id) {
        if (!topLevelFolderIds.includes(folder.parent_id)) {
          folderIdSet.add(folder.parent_id);
        }
      }
    }

    // Collect folder IDs from documents
    for (const document of matchingDocuments) {
      if (document.id && document.folder_id) {
        if (!topLevelFolderIds.includes(document.folder_id)) {
          folderIdSet.add(document.folder_id);
        }
      }
    }

    const folderIdsToProcess = [...folderIdSet];

    // Recursively fetch all parent folders
    const additionalParentFolderIds = await fetchAllParentFoldersRecursively(
      folderIdsToProcess,
      topLevelFolderIds
    );

    // Fetch detailed data for all parent folders
    const parentFolderDetails = await FolderModel.findAll({
      where: { id: [...topLevelFolderIds, ...additionalParentFolderIds] },
      attributes: ["id", "name", "description", "created_at", "updated_at"],
    });

    // Calculate counts for each parent folder
    const enrichedFolderData = await Promise.all(
      parentFolderDetails.map(async (folder) => {
        const subfolderCount = await FolderModel.count({
          where: { parent_id: folder.id },
        });

        const documentCount = await DocumentModel.count({
          where: { folder_id: folder.id },
        });

        return {
          id: folder.id,
          name: folder.name,
          description: folder.description,
          created_at: folder.created_at,
          subfolder_count: subfolderCount,
          doc_count: documentCount,
        };
      })
    );

    return { status: "success", data: enrichedFolderData };
  } catch (error) {
    console.error("Error fetching folders with counts:", error);
    return { status: "failure", message: error.message };
  }
};

/**
 * Recursively fetches all parent folders until no further parent_id exists.
 * @param {Array<number>} folderIds - IDs of folders to process.
 * @param {Array<number>} existingParentFolderIds - Already identified parent folder IDs.
 * @returns {Array<number>} - List of newly found parent folder IDs.
 */
const fetchAllParentFoldersRecursively = async (
  folderIds,
  existingParentFolderIds
) => {
  const parentFolders = await FolderModel.findAll({
    where: { id: folderIds },
    attributes: ["id", "name", "description", "created_at", "parent_id"],
  });

  const nextParentIdSet = new Set();

  for (const folder of parentFolders) {
    if (
      folder.parent_id &&
      !existingParentFolderIds.includes(folder.parent_id)
    ) {
      nextParentIdSet.add(folder.parent_id);
    }
  }

  const nextParentIds = [...nextParentIdSet];

  if (nextParentIds.length > 0) {
    const additionalParentIds = await fetchAllParentFoldersRecursively(
      nextParentIds,
      [...existingParentFolderIds, ...nextParentIds]
    );
    return [...nextParentIds, ...additionalParentIds];
  }

  return nextParentIds;
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
  fetchFoldersAndDocsCountService,
};
