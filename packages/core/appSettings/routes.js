let AbstractRouter = require("../abstract/router");
let Validator = require("./validators");
const Controller = require("./controllers");

module.exports = class extends AbstractRouter {
  routes = {
    listPublic: {
      method: "GET",
      path: "",
      description: "List public app settings.",
    },
    update: {
      method: "POST",
      path: "/{name}",
      description: "Update an app setting.",
    },
    getPublic: {
      method: "GET",
      path: "/{name}",
      description: "Get an app setting.",
    },
  };
  controllers = Controller(this.db).getControllers();
  validators = Validator();
};
