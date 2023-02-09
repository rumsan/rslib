const PinService = require("../PinService");
const axios = require("axios");

const requiredOptions = ["pin"];

module.exports = class FixedService extends PinService {
  constructor(options = {}) {
    super(options, requiredOptions);
  }

  async getPin(id) {
    this._checkId(id);
    return { success: true, deliveryAddress: id, pin: this.options.pin };
  }
};
