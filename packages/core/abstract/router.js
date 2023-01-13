const { SequelizeDB } = require("../utils");

module.exports = class AbstractRouter {
  routes = {};
  _controllers = null;
  _validators = null;
  constructor(options) {
    if (this.constructor == AbstractRouter) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    if (!options.name) throw new Error("AbstractRouter: Must send route name.");

    this.name = options.name;

    if (options.controller) this.setController(options.controller);
    if (options.validator) this.setValidator(options.validator);
    if (options.routes) this.addRoutes(options.routes);
  }

  setController(controller) {
    if (!controller?.getRegisteredControllers)
      throw new Error(
        "Controller must have getRegisteredControllers function."
      );
    this._controllers = controller;
  }

  setValidator(validator) {
    this._validators = validator.getValidators
      ? validator.getValidators()
      : validator;
  }

  addRoutes(routes) {
    this.routes = { ...this.routes, ...routes };
  }

  addRouteWithController(route, controller) {
    this._controllers.registerControllers(controller);
    this.addRoutes(route);
  }

  getRoutes() {
    return this.routes;
  }

  register(app) {
    if (!this._controllers)
      throw new Error("Must send a controller to the router.");
    app.register({
      name: this.name,
      routes: this.routes,
      validators: this._validators,
      controllers: this._controllers.getRegisteredControllers(),
    });
  }
};
