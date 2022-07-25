const { throwError, ERR, checkCondition } = require("../../../error");

module.exports = {
  async signupUsingEmail(payload) {
    checkCondition(payload.email, "Must send email.");
    if (this.config.enablePasswordAuthentication && !payload.password)
      throw new Error(
        "Must send password when enablePasswordAuthentication is true"
      );

    //TODO: use storedproc or atomic tx here
    let user = await this._add(payload);

    if (this.config.enablePasswordAuthentication)
      await this.authController.addPassword(
        payload.email,
        payload.password,
        user.id
      );
    return user;
  },
};
