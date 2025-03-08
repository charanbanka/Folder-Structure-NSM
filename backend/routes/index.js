const consts = require("../common/consts");
const fileRouter = require("./file");
const folderRouter = require("./folder");

module.exports = (app) => {
  app.use("/srv/health", (req, res) => res.send("success"));

  app.use("/srv/folder", folderRouter);
  app.use("/srv/file", fileRouter);
  app.use("*", (req, res) => {
    res
      .status(404)
      .send({ status: consts.SERVICE_FAILURE, message: "Invalid Url" });
  });
};
