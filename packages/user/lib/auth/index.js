let AbstractRouter = require("@rumsan/utils/lib/abstract/router");
let AuthValidator = require("./auth.validators");
const AuthController = require("./auth.controllers");

class Test extends AbstractRouter {
  routes = {
    authenticate: {
      method: "POST",
      path: "",
      description: "Authenticate user using selected services.",
    },
    manageUsingAction: {
      method: "POST",
      path: "/manage/",
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
  constructor(db, name, config, overwrites) {
    super(db, name);
    this.controllers =
      overwrites?.AuthController || new AuthController(db, config, overwrites);
    this.validators = overwrites?.AuthValidator || AuthValidator;
  }
}

module.exports = Test;
