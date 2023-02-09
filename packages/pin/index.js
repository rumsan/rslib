const PinService = require("./PinService");

class PIN {
  constructor(config) {
    this.services = {};
    this.config = config;
  }

  createService(name, optionsOrFunction) {
    if (!optionsOrFunction || typeof optionsOrFunction === "string")
      throw new Error("Invalid service options. Pass options object or function.");
    if (optionsOrFunction instanceof PinService) {
      this.services[name] = optionsOrFunction;
    } else {
      this.services[name] = this._createService(name, optionsOrFunction);
    }
    return this.services[name];
  }

  _createService(name, options) {
    try {
      const Service = require(`./services/${name}`);
      this.services[name] = new Service(options);
      return this.services[name];
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        throw new Error(`PIN Service [${name}] not found.`);
      }
      throw e;
    }
  }

  getService(name) {
    if (this.serviceExist(name)) {
      return this.services[name];
    }

    throw new Error(`PIN Service [${name}] not found.`);
  }

  removeService(name) {
    if (this.serviceExist(name)) {
      delete this.services[name];
    }
  }

  listServices() {
    return Object.keys(this.services);
  }

  serviceExist(name) {
    return !!this.services[name];
  }
}

module.exports = PIN;
