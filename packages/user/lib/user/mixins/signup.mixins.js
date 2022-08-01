const { throwError, ERR, checkCondition } = require("../../../error");
const Config = require("../../../config");

module.exports = {
  async signupUsingEmail(payload) {
    checkCondition(payload.email, "Must send email.");
    if (Config.enablePasswordAuthentication && !payload.password)
      throwError(
        "Must send password when enablePasswordAuthentication is true"
      );

    //TODO: use storedproc or atomic tx here
    let user = await this._add(payload);
    return user;
  },
};
