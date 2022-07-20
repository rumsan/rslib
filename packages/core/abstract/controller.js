var EventEmitter = require("events");
module.exports = class AbstractController extends EventEmitter {
  constructor(db, config) {
    super();
    if (this.constructor == AbstractController) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    if (!db)
      throw new Error(
        "AbstractController:Must send valid sequelize db reference."
      );
    this.db = db;
    this.config = config;
  }

  registrations = {};

  addControllers(newControllers) {
    this.registrations = { ...this.registrations, ...newControllers };
  }

  getControllers() {
    return this.registrations;
  }
};
