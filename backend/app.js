require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const router = require("./routes");
const config = require("./common/config");
const constants = require("./common/consts");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs")

const app = express();

const corsOptions = {
  origin: config.allowOrigin,
};

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(fileUpload());
// Serve static files correctly
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${path.basename(filePath)}"`
      );
      res.setHeader("Content-Type", "application/pdf"); // Set correct MIME type
    },
  })
);

// 📌 API to Serve File Data
app.get("/api/files/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "upload", filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
  }

  // Serve the file
  res.sendFile(filePath);
});

router(app);

app.use(errorHandler);

function errorHandler(err, req, res, next) {
  console.log("errorHandler - err:", err);

  res.json({
    status: constants.SERVICE_FAILURE,
    statusCode: 500,
    message: constants.GENERAL_ERROR_MESSAGE,
  });
}

module.exports = app;
