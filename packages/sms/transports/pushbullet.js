const Transport = require("../Transport");
const axios = require("axios");

const requiredOptions = ["accessToken", "deviceId"];

module.exports = class PushBulletTransport extends Transport {
  constructor(options = {}) {
    super(options, requiredOptions);
    this.options.url = this.options.url || "https://api.pushbullet.com/v2/ephemerals";
    this.options.packageName = this.options.packageName || "com.pushbullet.android";
  }

  async send(phone, message) {
    const payload = {
      push: {
        conversation_iden: phone,
        message,
        package_name: this.options.packageName,
        target_device_iden: this.options.deviceId,
        type: "messaging_extension_reply",
      },
      type: "push",
    };
    return axios
      .post(`${this.options.url}`, payload, {
        headers: { "Access-Token": this.options.accessToken },
      })
      .then((res) => {
        return { success: true, data: res.data };
      })
      .catch((error) => {
        return { success: false, message: error.message, error };
      });
  }
};
