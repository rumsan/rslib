const core = require("./utils/core");
module.exports = {
  loadModule: core.loadNodeModule,
  RSConfig: require("./utils/config"),
  SequelizeDB: require("./utils/sequelizeDb"),
  AppSettings: require("./appSettings"),
  Utils: require("./utils"),
  Services: require("./services"),
};
