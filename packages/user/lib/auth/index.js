let AbstractRouter = require("@rumsan/core/abstract/router");
let Validator = require("./auth.validators");
const Controller = require("./auth.controllers");

module.exports = class extends AbstractRouter {
  constructor(db, name, config) {
    super(db, name, config);
    this.addController(new Controller(this.db, this.config));
    this.addValidator(new Validator(this.config));
  }
  routes = {
    authenticate: {
      method: "POST",
      path: "",
      description: "Authenticate user using selected services.",
    },
    getOtpForService: {
      method: "POST",
      path: "/otp",
      description: "Get OTP for user",
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
};
