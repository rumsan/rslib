const AbstractController = require("@rumsan/core/abstract/controller");
const AuthModel = require("./auth.model");
const { RSConfig } = require("@rumsan/core");

const { ERR, throwError, checkCondition } = require("../../error");
const { AUTH_ACTIONS } = require("../../constants");
const {
  CryptoUtils: { saltAndHash, hash },
  DateUtils: { getUnixTimestamp },
  WalletUtils: { generateDataToSign, validateSignature },
} = require("@rumsan/core/utils");

/**
 * Any where you want to get user data after the function,
 * call this function for UserController and pass the callback function.
 */

module.exports = class extends AbstractController {
  constructor(options = {}) {
    super(options);
    this.table = this.tblAuths =
      this.db.models.tblAuths || new AuthModel().init();
  }

  registrations = {
    authenticate: (req) =>
      this.authenticate(req.payload.service, req.payload.data),
    add: (req) => this.add(req.payload),
    manageUsingAction: (req) =>
      this.remove(req.params.userId, req.payload.action, req.payload.data),
    listUserAuthServices: (req) => this.remove(req.params.userId),
    removeUserAuthService: (req) =>
      this.remove(req.params.userId, req.payload.service),
    getOtpForService: (req) =>
      this.getOtpForService(req.payload.service, req.payload.serviceId),
    getSignDataForWalletAuth: (req) =>
      this.getSignDataForWalletAuth(req.query.cid, req.info.clientIpAddress),
    authenticateUsingWallet: (req) =>
      this.authenticateUsingWallet(
        req.payload.signature,
        req.payload.signPayload,
        req.info.clientIpAddress
      ),
  };

  manageUsingAction(userId, action, data) {
    if (action === AUTH_ACTIONS.CHANGE_PASSWORD) {
      checkCondition(data.password, "Must send valid password.");
    }
  }

  getById(id) {
    return this.tblAuths.findByPk(id);
  }

  async getByServiceId(service, serviceId, errMsg) {
    let auth = await this.tblAuths.findOne({
      where: { service, serviceId },
      attributes: { exclude: ["password"] },
    });
    if (!auth && errMsg) throwError(errMsg);
    return auth;
  }

  async add(payload, validDurationInSeconds) {
    const { service, serviceId } = payload;
    let auth = await this.tblAuths.findOne({
      where: { service, serviceId },
    });
    if (auth) return auth;
    payload.otp = this._createOtp(validDurationInSeconds);
    if (payload.password)
      payload.password = await this._createPassword(payload.password);
    return this.tblAuths.create(payload);
  }

  listUserAuthServices(userId) {
    return this.tblAuths.findAll({ userId });
  }

  removeUserAuthService(userId, service) {
    return this.tblAuths.destroy({ userId, service });
  }

  async addPassword(email, password) {
    checkCondition(email, "Must send email.");
    checkCondition(password, "Must send password.");

    let auth = await this.getByServiceId("email", email);
    checkCondition(auth, "User auth does not exists");
    const { salt, hash } = await this._createPassword(password);

    return this.tblAuths.update(
      { password: { salt, hash } },
      { where: { service: "email", serviceId: email } }
    );
  }

  async _createPassword(password) {
    const saltHash = await saltAndHash(password);
    const salt = saltHash.salt.toString("base64");
    const hash = saltHash.hash.toString("base64");
    return { salt, hash };
  }

  _createOtp(validDurationInSeconds) {
    validDurationInSeconds =
      validDurationInSeconds || RSConfig.get("otpValidateDuration") || 600;
    const code = Math.floor(100000 + Math.random() * 900000);
    const expireOn = getUnixTimestamp() + validDurationInSeconds;
    return { code, expireOn };
  }

  async getOtpForService(service, serviceId, validDurationInSeconds) {
    let auth = await this.getByServiceId(
      service,
      serviceId,
      `${serviceId} does not exist.`
    );

    auth.otp = this._createOtp(validDurationInSeconds);
    this.emit("otp-created", auth.otp.code, service, serviceId, auth);
    return true;
  }

  async authenticateUsingPassword(email, password) {
    checkCondition(email, "Must send email.");
    checkCondition(password, "Must send password.");

    let auth = await this.tblAuths.findOne({
      where: { service: "email", serviceId: email },
    });

    if (!auth) {
      if (RSConfig.get("isDevEnvironment")) {
        throw throwError(ERR.AUTH_NOEXISTS);
      } else {
        throw throwError(ERR.LOGIN_INVALID);
      }
    }
    const hashedPwd = await hash(
      password,
      Buffer.from(auth.password.salt, "base64")
    );

    if (auth.password.hash !== hashedPwd.hash.toString("base64"))
      if (RSConfig.get("isDevEnvironment")) {
        throw throwError(ERR.PWD_NOTMATCH);
      } else {
        throw throwError(ERR.LOGIN_INVALID);
      }

    return auth.userId;
  }

  async authenticateUsingOtp(service, serviceId, otp) {
    let auth = await this.getByServiceId(
      service,
      serviceId,
      `${serviceId} does not exist.`
    );

    checkCondition(auth.otp?.code, "Invalid OTP");
    checkCondition(
      auth.otp.code.toString() === otp.toString(),
      "Invalid OTP sent"
    );
    checkCondition(auth.otp.expireOn > getUnixTimestamp(), "OTP has expired.");
    return auth.userId;
  }

  async getSignDataForWalletAuth(clientId, ip) {
    return generateDataToSign(clientId, {
      ip,
      secret: RSConfig.get("secret"),
      validDurationInSeconds: RSConfig.get("otpValidateDuration") || 600,
    });
  }

  async authenticateUsingWallet(signature, signPayload, clientIpAddress) {
    const { clientId, address } = validateSignature(signature, signPayload, {
      ip: clientIpAddress,
      secret: RSConfig.get("secret"),
    });

    let auth = await this.tblAuths.findOne({
      where: { service: "wallet", serviceId: address.toLowerCase() },
      attributes: { exclude: ["password"] },
    });

    checkCondition(auth, `Wallet address [${address}] does not exist.`);
    return { clientId, address, userId: auth.userId };
  }
};
