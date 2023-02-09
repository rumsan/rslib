const Transport = require("../Transport");
const axios = require("axios");

const requiredOptions = ["token"];

module.exports = class PrabhuTransport extends Transport {
  constructor(options = {}) {
    super(options, requiredOptions);
    this.options.url = this.options.url || "https://smsml.creationsoftnepal.com/SendBulkV1";
  }

  async send(phone, message) {
    return axios
      .post(`${this.options.url}?token=${this.options.token}`, [
        {
          Message: message,
          MobileNumber: phone,
        },
      ])
      .then((res) => {
        return { success: true, data: res.data };
      })
      .catch((error) => {
        return { success: false, message: error.message, error };
      });
  }
};
