const PinService = require("../PinService");
const { randomText, randomNumber } = require("@rumsan/core/utils/mathUtils");

const requiredOptions = [];

module.exports = class RandomService extends PinService {
  constructor(options = {}) {
    super(options, requiredOptions);
    this.options.length = options.length || 6;
    this.options.useText = options.useText || false;
  }

  async getPin(id) {
    this._checkId(id);
    if (this.options.useText)
      return {
        success: true,
        deliveryAddress: id,
        length: this.options.length,
        pin: randomText(this.options.length),
      };
    else
      return {
        success: true,
        deliveryAddress: id,
        length: this.options.length,
        pin: randomNumber(this.options.length),
      };
  }
};
