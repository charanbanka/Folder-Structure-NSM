module.exports = {
    server_port: process.env.SERVER_PORT,
    allowhosts: process.env.ALLOW_HOST,
    allowOrigin: process.env.ALLOW_ORIGIN,
    dbconfig: {
      dbname: process.env.DB_NAME,
      dbuser: process.env.DB_USER,
      dbpassword: process.env.DB_PASSWORD,
      dbhost: process.env.DB_HOST,
      dbport: process.env.DB_PORT,
    },
  };