module.exports = class AbstractRouter {
  routes = {};
  constructor(options) {
    if (this.constructor == AbstractRouter) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    Object.assign(this, options);
    if (!this.name) throw new Error("AbstractRouter: Must send route name.");
    if (!this.db)
      throw new Error(
        "AbstractRouter: Must send valid sequelize db reference."
      );
    // this.name = name;
    // this.db = db;
    // this.config = config;
    // this.listeners = listeners;
  }

  setController(controller) {
    if (controller.getRegisteredControllers) {
      this.Controller = controller;
      this.controllers = controller.getRegisteredControllers();
    } else {
      this.controllers = controller;
    }
  }

  setValidator(validator) {
    this.validators = validator.getValidators
      ? validator.getValidators()
      : validator;
  }

  addRoutes(routes) {
    this.routes = { ...this.routes, ...routes };
  }

  getRoutes() {
    return this.routes;
  }

  register(app) {
    app.register({
      name: this.name,
      routes: this.routes,
      validators: this.validators,
      controllers: this.controllers,
    });
  }
};
