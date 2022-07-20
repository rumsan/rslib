let AbstractRouter = require("@rumsan/core/abstract/router");
let Validator = require("./role.validators");
const Controller = require("./role.controllers");

module.exports = class extends AbstractRouter {
  constructor(db, name, config) {
    super(db, name, config);
    this.addController(new Controller(this.db, this.config));
    this.addValidator(new Validator(this.config));
  }
  routes = {
    add: {
      method: "POST",
      path: "",
      description: "Add a new role.",
    },
    list: {
      method: "GET",
      path: "",
      description: "List all roles.",
    },
    get: {
      method: "GET",
      path: "/{name}",
      description: "Get role by name.",
    },
    remove: {
      method: "DELETE",
      path: "/{name}",
      description: "Remove role by name.",
    },
    addPermissions: {
      method: "POST",
      path: "/{name}/permissions",
      description: "Add permissions for the role.",
    },
    removePermissions: {
      method: "DELETE",
      path: "/{name}/permissions",
      description: "Remove permissions for the role.",
    },
  };
};
