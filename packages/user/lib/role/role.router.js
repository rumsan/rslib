let AbstractRouter = require("@rumsan/core/abstract/router");
let Validator = require("./role.validators");
const Controller = require("./role.controllers");
const { PERMISSIONS } = require("../../constants");

module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "roles";
    super(options);
    this.setController(new Controller(options));
    this.setValidator(new Validator(options));
  }
  routes = {
    add: {
      method: "POST",
      path: "",
      description: "Add a new role.",
      permissions: [PERMISSIONS.ROLE_WRITE, PERMISSIONS.ROLE_MANAGE],
    },
    list: {
      method: "GET",
      path: "",
      description: "List all roles.",
      permissions: [PERMISSIONS.ROLE_READ, PERMISSIONS.ROLE_MANAGE],
    },
    get: {
      method: "GET",
      path: "/{name}",
      description: "Get role by name.",
      permissions: [PERMISSIONS.ROLE_READ, PERMISSIONS.ROLE_MANAGE],
    },
    remove: {
      method: "DELETE",
      path: "/{name}",
      description: "Remove role by name.",
      permissions: [PERMISSIONS.ROLE_DELETE, PERMISSIONS.ROLE_MANAGE],
    },
    addPermissions: {
      method: "POST",
      path: "/{name}/permissions",
      description: "Add permissions for the role.",
      permissions: [PERMISSIONS.ROLE_WRITE, PERMISSIONS.ROLE_MANAGE],
    },
    removePermissions: {
      method: "DELETE",
      path: "/{name}/permissions",
      description: "Remove permissions for the role.",
      permissions: [PERMISSIONS.ROLE_WRITE, PERMISSIONS.ROLE_MANAGE],
    },
  };
};
