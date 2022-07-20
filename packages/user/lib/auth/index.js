let AbstractRouter = require("@rumsan/utils/lib/abstract/router");
let Validator = require("./auth.validators");
const Controller = require("./auth.controllers");

module.exports = class extends AbstractRouter {
  routes = {
    authenticate: {
      method: "POST",
      path: "",
      description: "Authenticate user using selected services.",
    },
    manageUsingAction: {
      method: "POST",
      path: "/manage",
      description: "Manage using actions.",
    },
    listUserAuthServices: {
      method: "GET",
      path: "/manage/{userId}",
      description: "List auth types for user.",
    },
    removeUserAuthService: {
      method: "DELETE",
      path: "/manage/{userId}",
      description: "Remove auth service for user.",
    },
  };
  controllers = new Controller(this.db, this.config).getControllers();
  validators = new Validator(this.config).getValidators();
};
