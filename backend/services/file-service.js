const consts = require("../common/consts");
const {
  getFileExtension,
  generateUuid,
  saveFileInLocal,
} = require("../common/utils");
const join = require("path").join;

const DocumentModel = require("../models/documents");

const failureResp = {
  status: consts.SERVICE_FAILURE,
  message: consts.GENERAL_ERROR_MESSAGE,
};

const addFileService = async (reqInfo) => {
  const funName = "addFileService";
  try {
    let { file, folder_id } = reqInfo;
    if (!file) return { ...failureResp, message: "File is Required!" };

    if (!folder_id) return { ...failureResp, message: "Folder Id Required!" };

    let folder_path = join(__dirname, `../upload`);
    let extension = getFileExtension(file.name);
    let name = file.name;
    let file_name = `${generateUuid()}_${name}`;

    let file_url = folder_path + "/" + file_name;

    let resp = await saveFileInLocal(folder_path, file_url, file.data);

    //failed response
    if (!resp.status) {
      return { ...failureResp, message: resp.message };
    }

    //save metadata in files table

    let documentObject = {
      name: name,
      path: file_url,
      folder_id,
      extension,
    };

    console.log("daat", documentObject);

    let docResp = await DocumentModel.create(documentObject);

    return { status: consts.SERVICE_SUCCESS };
  } catch (error) {
    console.log(`error occured in ${funName} is`, error.message);
    return { status: consts.SERVICE_FAILURE, message: error.message };
  }
};

const fetchFileByIdService = async (reqInfo) => {
  const funName = "fetchFileByIdService";
  try {
    let { id } = reqInfo;
    if (!id) return { ...failureResp, message: "File Id Required!" };

    let data = await DocumentModel.findOne({
      where: { id },
      raw: true,
      plain: true,
    });

    return { status: consts.SERVICE_SUCCESS, data };
  } catch (error) {
    console.log(`error occured in ${funName} is`, error.message);
    return { status: consts.SERVICE_FAILURE, message: error.message };
  }
};

const fetchFileDataByIdService = async (req, res) => {
  const funName = "fetchFileByIdService";
  try {
    let { id } = req.params;
    if (!id) return { ...failureResp, message: "File Id Required!" };

    let data = await DocumentModel.findOne({
      where: { id },
      raw: true,
      plain: true,
    });

    const filePath = path.join(
      __dirname,
      "/../upload",
      path.basename(data.path)
    );

    console.log("path=>", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Serve the file
    res.sendFile(filePath);

    // return { status: consts.SERVICE_SUCCESS, data };
  } catch (error) {
    console.log(`error occured in ${funName} is`, error.message);
    // return { status: consts.SERVICE_FAILURE, message: error.message };
    res.status(500).send({ error: "Error fetching folder", details: error });
  }
};

const fetchFilesService = async (reqInfo) => {
  const funName = "fetchFilesService";
  try {
    return { status: consts.SERVICE_SUCCESS, data: "" };
  } catch (error) {
    console.log(`error occured in ${funName} is`, error.message);
    return { status: consts.SERVICE_FAILURE, message: error.message };
  }
};

const updateFileByIdService = async (reqInfo) => {
  const funName = "updateFileByIdService";
  try {
    let { name, id } = reqInfo;

    await DocumentModel.update({ name }, { where: { id } });
    return { status: consts.SERVICE_SUCCESS };
  } catch (error) {
    console.log(`error occured in ${funName} is`, error.message);
    return { status: consts.SERVICE_FAILURE, message: error.message };
  }
};

// Delete Folder by ID
const deleteFileByIdService = async ({ id }) => {
  const funName = "deleteFileByIdService";
  try {
    if (!id) return { ...failureResp, message: "Id is Required!" };

    let deleted = await DocumentModel.destroy({ where: { id } });

    if (deleted === 0) return { ...failureResp, message: "Folder not found!" };

    return { status: consts.SERVICE_SUCCESS };
  } catch (error) {
    console.error(`Error in ${funName}:`, error.message);
    return { status: consts.SERVICE_FAILURE, message: error.message };
  }
};

const fs = require("fs");
const path = require("path");

const fetchFilesFromLocalPath = async (req, res) => {
  const folderPath = path.join(__dirname, "../uploads"); // Adjust the local folder path

  try {
    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      return res
        .status(404)
        .json({ status: "failure", message: "Folder not found" });
    }

    // Read directory contents
    const files = fs.readdirSync(folderPath).map((file) => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);

      return {
        name: file,
        path: filePath,
        size: stats.size, // File size in bytes
        createdAt: stats.birthtime, // Creation date
        updatedAt: stats.mtime, // Last modified date
      };
    });

    res.json({ status: "success", data: files });
  } catch (error) {
    console.error("Error reading files:", error);
    res.status(500).json({ status: "failure", message: error.message });
  }
};

module.exports = { fetchFilesFromLocalPath };

module.exports = {
  addFileService,
  fetchFileByIdService,
  fetchFilesService,
  updateFileByIdService,
  deleteFileByIdService,
  fetchFileDataByIdService,
};
