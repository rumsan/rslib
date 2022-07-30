/**
 * config options
 * - responseType (raw or api)
 *
 * Options
 * - db
 * - config
 * - mixins
 * - listeners
 */
var EventEmitter = require("events");
const { SequelizeDB } = require("../utils");
module.exports = class AbstractController extends EventEmitter {
  registrations = {};
  constructor(options) {
    super();
    this.db = SequelizeDB.db;
    if (this.constructor == AbstractController) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    Object.assign(this, options);
    if (!this.db)
      throw new Error(
        "AbstractController:Must send valid sequelize db reference."
      );
    if (this.mixins) this.addMixins(this.mixins);
    if (this.listeners) this.addListeners(this.listeners);
  }

  addMixins(mixins) {
    Object.assign(this, mixins);
  }

  addListeners(listeners) {
    let event = Object.keys(listeners);
    event.forEach((e) => {
      this.on(e, listeners[e]);
    });
  }

  registerControllers(newControllers) {
    this.registrations = { ...this.registrations, ...newControllers };
  }

  getRegisteredControllers() {
    return this.registrations;
  }
};
