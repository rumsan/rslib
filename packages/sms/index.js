const Transport = require("./Transport");

class SMS {
  constructor(config) {
    this.transports = {};
    this.config = config;
  }

  createTransport(name, optionsOrFunction) {
    if (!optionsOrFunction || typeof optionsOrFunction === "string")
      throw new Error("Invalid transport options. Pass options object or function.");
    if (optionsOrFunction instanceof Transport) {
      this.transports[name] = optionsOrFunction;
    } else {
      this.transports[name] = this._createTransport(name, optionsOrFunction);
    }
    return this.transports[name];
  }

  _createTransport(name, options) {
    try {
      const Transport = require(`./transports/${name}`);
      this.transports[name] = new Transport(options);
      return this.transports[name];
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        throw new Error(`SMS Transport [${name}] not found.`);
      }
    }
  }

  getTransport(name) {
    if (this.transportsExist(name)) {
      return this.transports[name];
    }

    throw new Error(`SMS Transport [${name}] not found.`);
  }

  removeTransport(name) {
    if (this.transportsExist(name)) {
      delete this.transports[name];
    }
  }

  listTransports() {
    return Object.keys(this.transports);
  }

  transportsExist(name) {
    return !!this.transports[name];
  }
}

module.exports = SMS;
