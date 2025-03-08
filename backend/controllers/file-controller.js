const consts = require("../common/consts");
const fileService = require("../services/file-service");

const addFile = async (req, res) => {
  console.log("Headers:", req.headers["content-type"]);
  console.log("Received files:", req.files);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let { file } = req.files; // Ensure 'file' matches frontend key
  let body = req.body;
  console.log("Received file:", body);

  let resp = await fileService.addFileService({ file, ...body });

  res.send(resp);
};

const fetchFileById = async (req, res) => {
  let body = req.body;
  let resp = await fileService.fetchFileByIdService({ ...body });
  res.send(resp);
};

const fetchFileDataById = async (req, res) => {
  // let body = req.body;
  await fileService.fetchFileDataByIdService(req, res);
};

const fetchFiles = async (req, res) => {
  let body = req.body;
  let resp = await fileService.fetchFilesService({ ...body });
  res.send(resp);
};

const updateFileById = async (req, res) => {
  let body = req.body;
  let { id } = req.params;
  let resp = await fileService.updateFileByIdService({ ...body, id });
  res.send(resp);
};

const deleteFileById = async (req, res) => {
  let { id } = req.params;

  let resp = await fileService.deleteFileByIdService({ id });
  res.send(resp);
};

module.exports = {
  addFile,
  fetchFileById,
  fetchFiles,
  updateFileById,
  deleteFileById,
  fetchFileDataById,
};
