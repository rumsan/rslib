const { throwError, ERR, checkCondition } = require("../../../error");

module.exports = {
  async signupUsingEmail(payload) {
    checkCondition(payload.email, "Must send email.");
    if (this.config.enablePasswordAuthentication && !payload.password)
      throwError(
        "Must send password when enablePasswordAuthentication is true"
      );

    //TODO: use storedproc or atomic tx here
    let user = await this._add(payload);
    return user;
  },
};
