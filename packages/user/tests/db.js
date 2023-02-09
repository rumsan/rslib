const env = require("./env.js");

const SequelizeDB = require("@rumsan/core").SequelizeDB;
SequelizeDB.init(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
});
