const {
  CryptoUtils: { generateJwtToken },
} = require("@rumsan/core/utils");
const { getAddressFromSignature } = require("@rumsan/core/utils/walletUtils");
const { throwError, ERR } = require("../../../error");

module.exports = {
  setAccessTokenData(data) {
    return {
      user: { id: data.user.id, name: data.user.name },
      permissions: data.permissions,
    };
  },

  async loginSuccess(userId) {
    let user = await this.getById(userId);
    let permissions = await this.roleController.calculatePermissions(
      user.roles
    );
    const accessTokenData = this.setAccessTokenData({ user, permissions });
    console.log(accessTokenData);
    const accessToken = generateJwtToken(
      accessTokenData,
      this.config.appSecret,
      this.config.jwtDuration
    );
    this.emit("login-success", accessToken, user, permissions);
    return { accessToken, user, permissions };
  },

  async loginUsingPassword(email, password) {
    if (!this.config.enablePasswordAuthentication)
      throwError(
        "Cannot login using password when enablePasswordAuthentication is false"
      );

    const userId = await this.authController.authenticateUsingPassword(
      email,
      password
    );
    return this.loginSuccess(userId);
  },

  async loginUsingOtp(service, serviceId, otp) {
    const userId = await this.authController.authenticateUsingOtp(
      service,
      serviceId,
      otp
    );
    return this.loginSuccess(userId);
  },

  async loginUsingWallet(signature, signPayload) {
    const userId = await getAddressFromSignature(signature, signPayload);
    return this.loginSuccess(userId);
  },
};
