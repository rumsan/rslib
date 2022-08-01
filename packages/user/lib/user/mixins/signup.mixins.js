const { throwError, ERR, checkCondition } = require("../../../error");
const { RSConfig } = require("@rumsan/core");

module.exports = {
  async signupUsingEmail(payload) {
    checkCondition(payload.email, "Must send email.");
    if (RSConfig.get("enablePasswordAuthentication") && !payload.password)
      throwError(
        "Password-based authentication has been disabled for this application."
      );

    //TODO: use storedproc or atomic tx here
    let user = await this._add(payload);
    return user;
  },
};
