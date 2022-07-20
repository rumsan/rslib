module.exports = class AbstractRouter {
  routes = {};

  constructor(db, name, config) {
    if (this.constructor == AbstractRouter) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    if (!name) throw new Error("AbstractRouter: Must send route name.");
    if (!db)
      throw new Error(
        "AbstractRouter: Must send valid sequelize db reference."
      );
    this.name = name;
    this.db = db;
    this.config = config;
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