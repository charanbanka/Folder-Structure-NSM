const express = require("express");
const fileController = require("../controllers/file-controller");

const fileRouter = express.Router();

fileRouter.post("/add", fileController.addFile);
fileRouter.post("/fetch", fileController.fetchFiles);
fileRouter.get("/fetchbyid/:id", fileController.fetchFileById);
fileRouter.get("/fetchdatabyid/:id", fileController.fetchFileDataById);
fileRouter.post("/update/:id", fileController.updateFileById);
fileRouter.get("/delete/:id", fileController.deleteFileById);

module.exports = fileRouter;
