const { throwError, ERR, checkCondition } = require("../../../error");
const { RSConfig } = require("@rumsan/core");

module.exports = {
  async signupUsingEmail(payload) {
    checkCondition(payload.email, "Must send email.");
    if (RSConfig.get("enablePasswordAuthentication") && !payload.password)
      throwError(
        "Password-based authentication has been disabled for this application."
      );

    payload.authPayload = {
      service: "email",
      serviceId: payload.email,
    };

    if (RSConfig.get("enablePasswordAuthentication"))
      payload.authPayload.password = payload.password;

    return this._add(payload);
  },

  async signupUsingWallet(payload) {
    checkCondition(payload.wallet, "Must send wallet.");

    payload.authPayload = {
      service: "wallet",
      serviceId: payload.wallet,
    };

    return this._add(payload);
  },
};
