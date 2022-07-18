let AbstractRouter = require("@rumsan/utils/lib/abstract/router");
let RoleValidator = require("./role.validators");
const RoleController = require("./role.controllers");

class Test extends AbstractRouter {
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
  constructor(db, name, config, overwrites) {
    super(db, name);
    this.controllers =
      overwrites?.RoleController || new RoleController(db, config, overwrites);
    this.validators = overwrites?.RoleValidator || RoleValidator;
  }
}

module.exports = Test;
