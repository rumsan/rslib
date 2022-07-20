let AbstractRouter = require("@rumsan/utils/lib/abstract/router");
let Validator = require("./user.validators");
const Controller = require("./user.controllers");

module.exports = class extends AbstractRouter {
  routes = {
    add: {
      method: "POST",
      path: "",
      description: "Add new user.",
    },
    list: {
      method: "GET",
      path: "",
      description: "List all users",
    },
    login: {
      method: "POST",
      path: "/login",
      description: "Login using password",
    },
    getById: {
      method: "GET",
      path: "/{id}",
      description: "Get user by id.",
    },
    update: {
      method: "POST",
      path: "/{id}",
      description: "Update user details.",
    },
    addRoles: {
      method: "POST",
      path: "/{id}/roles",
      description: "Update user roles.",
    },
    updateEmail: {
      method: "POST",
      path: "/{id}/email",
      description: "Update user email.",
    },
    updatePhone: {
      method: "POST",
      path: "/{id}/phone",
      description: "Update user phone number.",
    },
    remove: {
      method: "DELETE",
      path: "/{id}",
      description: "Remove user.",
    },
  };

  controllers = new Controller(this.db, this.config).getControllers();
  validators = new Validator(this.config).getValidators();
};
