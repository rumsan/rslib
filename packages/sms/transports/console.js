const Transport = require("../Transport");

const requiredOptions = ["username", "password"];

module.exports = class ConsoleTransport extends Transport {
  constructor(options = {}) {
    super(options);
  }

  async send(phone, message) {
    console.log(phone, ":", message);
    return true;
  }
};
