const EventEmitter = require("events");
module.exports = class Transport extends EventEmitter {
  constructor(options, requiredOptions = []) {
    super();
    this.options = options;
    this._checkForRequiredOptions(requiredOptions);
  }

  _checkForRequiredOptions(requiredOptions) {
    requiredOptions.forEach((option) => {
      if (!this.options[option]) {
        throw new Error(`ERROR: Must pass option [${option}] in constructor.`);
      }
    });
  }

  async send(phone, message) {
    throw new Error("ERROR: Send Not Implemented");
  }
};
