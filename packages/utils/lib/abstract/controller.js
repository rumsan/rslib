module.exports = class AbstractController {
  constructor(db, config, overwrites = {}) {
    if (this.constructor == AbstractController) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    if (!db) throw new Error("Must send valid sequelize db reference.");
    if (!config) throw new Error("Must send config parameter");
    this.db = db;
    this.config = config;
    if (overwrites.ERR) ERR = overwrites.ERR;
  }

  registrations = {};

  _register(newControllers) {
    this.registrations = { ...this.registrations, ...newControllers };
  }
};
