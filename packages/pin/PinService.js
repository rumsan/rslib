const EventEmitter = require("events");
const { rscheck } = require("@rumsan/core");
module.exports = class PinService extends EventEmitter {
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

  _checkId(id) {
    rscheck(id, "must send id");
  }

  async getPin(id) {
    throw new Error("getPin() method must be implemented");
  }
};
