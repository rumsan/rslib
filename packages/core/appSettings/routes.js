let AbstractRouter = require("../abstract/router");
let Validator = require("./validators");
const Controller = require("./controllers");
var events = require("events");

module.exports = class extends AbstractRouter {
  events = new events.EventEmitter();
  constructor(db, name) {
    super(db, name);
  }
  routes = {
    listPublic: {
      method: "GET",
      path: "",
      description: "List public app settings.",
    },
    update: {
      method: "POST",
      path: "/{name}",
      description: "Update an app setting.",
    },
    getPublic: {
      method: "GET",
      path: "/{name}",
      description: "Get an app setting.",
    },
  };
  controllers = Controller(this.db, this.events).getControllers();
  validators = Validator();
};
