const {
  CryptoUtils: { generateJwtToken },
} = require("@rumsan/core/utils");
const { throwError, ERR } = require("../../../error");
const { RSConfig } = require("@rumsan/core");

module.exports = {
  setAccessTokenData(data) {
    return {
      user: { name: data.user.name },
      permissions: data.permissions,
    };
  },

  async loginSuccess(userId, clientIpAddress) {
    let user = await this.getById(userId);
    let permissions = await this.roleController.calculatePermissions(
      user.roles
    );
    let accessTokenData = this.setAccessTokenData({ user, permissions });
    accessTokenData.userId = user.id;
    accessTokenData.ip = clientIpAddress;

    if (!accessTokenData.user)
      throw new Error("Must send user to object to access token data.");
    if (!accessTokenData.userId)
      throw new Error("Access token must have user id");

    const accessToken = generateJwtToken(
      accessTokenData,
      RSConfig.get("secret"),
      RSConfig.get("jwtDuration")
    );
    this.emit("login-success", accessToken, user, permissions);
    return { accessToken, user, permissions };
  },

  async loginUsingPassword(email, password, { clientIpAddress }) {
    if (!RSConfig.get("enablePasswordAuthentication"))
      throwError(
        "Password-based authentication has been disabled for this application."
      );

    const userId = await this.authController.authenticateUsingPassword(
      email,
      password
    );
    return this.loginSuccess(userId, clientIpAddress);
  },

  async loginUsingOtp(service, serviceId, otp, { clientIpAddress }) {
    const userId = await this.authController.authenticateUsingOtp(
      service,
      serviceId,
      otp
    );
    return this.loginSuccess(userId, clientIpAddress);
  },

  async loginUsingWallet(signature, signPayload, { clientIpAddress }) {
    const {
      userId,
      clientId: WSClientId,
      address,
    } = await this.authController.authenticateUsingWallet(
      signature,
      signPayload,
      clientIpAddress
    );
    const { accessToken, user, permissions } = await this.loginSuccess(
      userId,
      clientIpAddress
    );
    this.emit("wallet-login-success", WSClientId, accessToken, {
      user,
      permissions,
      address,
    });
    return this.loginSuccess(userId, clientIpAddress);
  },
};
