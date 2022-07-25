/**
 * config options
 * - returnDataType (raw or api)
 */
var EventEmitter = require("events");
module.exports = class AbstractController extends EventEmitter {
  registrations = {};
  constructor(options) {
    super();
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

  getResponse(data, type) {
    type = type || this.config.responseType;
    if (type === "raw") return data;
    data = JSON.stringify(data);
    data = JSON.parse(data);
    if (type === "api") return { success: true, data };
    return data;
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
