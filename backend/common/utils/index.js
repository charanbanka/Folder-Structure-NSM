const fs = require("fs").promises;
const fssync = require("fs");
const uuid = require("uuid");

const saveFileInLocal = async (folder_path, file_url, data) => {
  const funName = "saveFileInLocal";
  try {
    if (!fssync.existsSync(folder_path)) {
      fssync.mkdirSync(folder_path, { recursive: true });
    }

    await fs.writeFile(file_url, data);
    return { status: true };
  } catch (error) {
    console.log(`Error occured in ${funName} is`, error.message);
    return { status: true };
  }
};

const getFileExtension = (fileName) => {
  return fileName?.split(".")?.pop();
};

const generateUuid = () => {
  return uuid.v4();
};

module.exports = { saveFileInLocal, getFileExtension, generateUuid };
