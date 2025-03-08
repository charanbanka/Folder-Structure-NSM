const express = require("express");
const folderController = require("../controllers/folder-controller");

const folderRouter = express.Router();

folderRouter.post("/add", folderController.addFolder);

// Fetch parent folders only
folderRouter.get("/parentfolders", folderController.fetchParentFolders);

// Fetch children by parent
folderRouter.get(
  "/fetchbyparent/:parent_id",
  folderController.fetchFolderChildren
);

// Fetch a single folder by its ID
folderRouter.get("/fetchbyid/:id", folderController.fetchFolderById);

// Update a folder by its ID
folderRouter.post("/update/:id", folderController.updateFolderById);

// Delete a folder by its ID (fix naming issue)
folderRouter.get("/delete/:id", folderController.deleteFolderById);

module.exports = folderRouter;
