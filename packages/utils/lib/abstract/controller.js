module.exports = class AbstractController {
  constructor(db, config) {
    if (this.constructor == AbstractController) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    if (!db)
      throw new Error(
        "AbstractController:Must send valid sequelize db reference."
      );
    if (!config)
      throw new Error("AbstractController:Must send config parameter");
    this.db = db;
    this.config = config;
  }

  registrations = {};

  add(newControllers) {
    this.registrations = { ...this.registrations, ...newControllers };
  }

  get() {
    return this.registrations;
  }
};
