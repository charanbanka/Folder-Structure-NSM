require("dotenv").config();
const config = require("./common/config");

try {
  const app = require("./app");
  const db = require("./common/db");

  db.authenticate()
    .then(() => {
      console.log("DB connection established successfully.");
      db.sync();
      // import all models

      const folders = require("./models/folders");
      const documents = require("./models/documents");
    })
    .catch((error) => {
      console.log("Unable to connect to the database", error);
    });

  app.listen(config.server_port, () => {
    console.log("Serverv running at port :", config.server_port);
  });
} catch (error) {
  console.log("error =>", error);
}
