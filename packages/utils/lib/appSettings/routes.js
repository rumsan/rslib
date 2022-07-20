let AbstractRouter = require("../abstract/router");
let Validator = require("./validators");
const Controller = require("./controllers");

module.exports = class extends AbstractRouter {
  routes = {
    update: {
      method: "POST",
      path: "/{name}",
      description: "Update an appSetting.",
    },
    getPublic: {
      method: "GET",
      path: "/{name}",
      description: "Get an appSetting.",
    },
  };
  controllers = Controller(this.db);
  validators = Validator;
};
