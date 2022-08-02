let AbstractRouter = require("@rumsan/core/abstract/router");
let Validator = require("./user.validators");
const Controller = require("./user.controllers");
const { PERMISSIONS } = require("../../constants");
module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "users";
    options.controller = options.controller || new Controller(options);
    options.validator = options.validator || new Validator(options);
    super(options);
  }
  routes = {
    add: {
      method: "POST",
      path: "",
      description: "Add new user.",
      permissions: [PERMISSIONS.USER_WRITE, PERMISSIONS.USER_MANAGE],
    },
    list: {
      method: "GET",
      path: "",
      description: "List all users",
      permissions: [PERMISSIONS.USER_READ, PERMISSIONS.USER_MANAGE],
    },
    login: {
      method: "POST",
      path: "/login",
      description: "Login using password",
    },
    loginUsingOtp: {
      method: "POST",
      path: "/login/otp",
      description: "Login using OTP",
    },
    getById: {
      method: "GET",
      path: "/{id}",
      description: "Get user by id.",
      permissions: [PERMISSIONS.USER_READ, PERMISSIONS.USER_MANAGE],
    },
    update: {
      method: "POST",
      path: "/{id}",
      description: "Update user details.",
      permissions: [PERMISSIONS.USER_WRITE, PERMISSIONS.USER_MANAGE],
    },
    addRoles: {
      method: "POST",
      path: "/{id}/roles",
      description: "Update user roles.",
      permissions: [
        PERMISSIONS.USER_WRITE,
        PERMISSIONS.USER_ROLEMANAGE,
        PERMISSIONS.USER_MANAGE,
      ],
    },
    updateEmail: {
      method: "POST",
      path: "/{id}/email",
      description: "Update user email.",
      permissions: [PERMISSIONS.USER_WRITE, PERMISSIONS.USER_MANAGE],
    },
    updatePhone: {
      method: "POST",
      path: "/{id}/phone",
      description: "Update user phone number.",
      permissions: [PERMISSIONS.USER_WRITE, PERMISSIONS.USER_MANAGE],
    },
    remove: {
      method: "DELETE",
      path: "/{id}",
      description: "Remove user.",
      permissions: [PERMISSIONS.ROLE_DELETE, PERMISSIONS.USER_MANAGE],
    },
  };
};
