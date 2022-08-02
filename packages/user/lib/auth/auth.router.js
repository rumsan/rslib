let AbstractRouter = require("@rumsan/core/abstract/router");
let Validator = require("./auth.validators");
const Controller = require("./auth.controllers");
const { PERMISSIONS } = require("../../constants");

module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "auth";
    options.controller = options.controller || new Controller(options);
    options.validator = options.validator || new Validator(options);
    super(options);
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
    getSignDataForWalletAuth: {
      method: "GET",
      path: "/wallet",
      description: "Get OTP for user",
    },
    manageUsingAction: {
      method: "POST",
      path: "/manage",
      description: "Manage using actions.",
      permissions: [PERMISSIONS.USER_WRITE, PERMISSIONS.USER_MANAGE],
    },
    listUserAuthServices: {
      method: "GET",
      path: "/manage/{userId}",
      description: "List auth types for user.",
      permissions: [PERMISSIONS.USER_WRITE, PERMISSIONS.USER_MANAGE],
    },
    removeUserAuthService: {
      method: "DELETE",
      path: "/manage/{userId}",
      description: "Remove auth service for user.",
      permissions: [PERMISSIONS.USER_WRITE, PERMISSIONS.USER_MANAGE],
    },
  };
};
