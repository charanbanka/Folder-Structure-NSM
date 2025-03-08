const folderService = require("../services/folder-service");

const addFolder = async (req, res) => {
  try {
    let resp = await folderService.addFolderService(req.body);
    res.status(200).send(resp);
  } catch (error) {
    res.status(500).send({ error: "Error adding folder", details: error });
  }
};

//  Fetch a single folder by ID
const fetchFolderById = async (req, res) => {
  try {
    let id = req.params.id;
    let resp = await folderService.fetchFolderByIdService(id);
    res.status(200).send(resp);
  } catch (error) {
    res.status(500).send({ error: "Error fetching folder", details: error });
  }
};

//  Fetch only parent folders (parent_id = null)
const fetchParentFolders = async (req, res) => {
  try {
    let resp = await folderService.fetchParentFoldersWithCounts();
    res.status(200).send(resp);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error fetching parent folders", details: error });
  }
};

//  Fetch child folders by parent_id
const fetchFolderChildren = async (req, res) => {
  try {
    let parent_id = req.params.parent_id;
    let resp = await folderService.fetchFolderChildren(parent_id);
    res.status(200).send(resp);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error fetching child folders", details: error });
  }
};

//  Fetch child folders by parent_id
const fetchFoldersByParent = async (req, res) => {
  try {
    let parent_id = req.params.parent_id;
    let resp = await folderService.fetchFoldersService(parent_id);
    res.status(200).send(resp);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error fetching child folders", details: error });
  }
};

//  Update folder by ID
const updateFolderById = async (req, res) => {
  try {
    let id = req.params.id;
    let resp = await folderService.updateFolderByIdService({ id, ...req.body });
    res.status(200).send(resp);
  } catch (error) {
    res.status(500).send({ error: "Error updating folder", details: error });
  }
};

//  Delete folder by ID (fixed function name)
const deleteFolderById = async (req, res) => {
  try {
    let id = req.params.id;
    let resp = await folderService.deleteFolderByIdService(id);
    res.status(200).send(resp);
  } catch (error) {
    res.status(500).send({ error: "Error deleting folder", details: error });
  }
};

module.exports = {
  addFolder,
  fetchFolderById,
  fetchParentFolders,
  fetchFoldersByParent,
  updateFolderById,
  deleteFolderById,
  fetchFolderChildren,
};
