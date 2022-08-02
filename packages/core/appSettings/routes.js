let AbstractRouter = require("../abstract/router");
let Validator = require("./validators");
const Controller = require("./controller");
module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.controller = Controller();
    if (options.listeners) options.controller.addListeners(options.listeners);
    options.validator = Validator();
    super(options);
  }
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
      permissions: ["app_manage"],
    },
    getPublic: {
      method: "GET",
      path: "/{name}",
      description: "Get an app setting.",
    },
  };
};
