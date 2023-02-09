const Transport = require("../Transport");
const axios = require("axios");

const requiredOptions = ["url"];

module.exports = class WebhookTransport extends Transport {
  constructor(options = {}) {
    super(options, requiredOptions);
  }

  async send(phone, message) {
    return axios
      .post(this.options.url, { content: `SMS: ${phone} | ${message}` })
      .then((res) => {
        return { success: true, data: res.data };
      })
      .catch((error) => {
        return { success: false, message: error.message, error };
      });
  }
};
