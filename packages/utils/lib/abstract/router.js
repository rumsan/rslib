module.exports = class AbstractRouter {
  routes = {};

  constructor(db, name) {
    if (this.constructor == AbstractRouter) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    if (!db) throw new Error("Must send valid sequelize db reference.");
    this.name = name;
  }

  addRoutes(routes) {
    this.routes = { ...this.routes, ...routes };
  }

  //Registration for HAPI application
  register(app) {
    app.register({
      name: this.name,
      routes: this.routes,
      validators: this.validators,
      controllers: this.controllers.registrations,
    });
  }
};
