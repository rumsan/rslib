const AbstractController = require("@rumsan/core/abstract/controller");
const AuthModel = require("./auth.model");

const { ERR, throwError, checkCondition } = require("../../error");
const { AUTH_ACTIONS } = require("../../constants");
const {
  CryptoUtils: { saltAndHash, hash },
  DateUtils: { getUnixTimestamp },
  WalletUtils: { generateDataToSign, getAddressFromSignature },
} = require("@rumsan/core/utils");
const { password } = require("../../../../play/env");

/**
 * Any where you want to get user data after the function,
 * call this function for UserController and pass the callback function.
 */

module.exports = class extends AbstractController {
  constructor(options) {
    const { db } = options;
    super(options);
    this.table = this.tblAuths =
      db.models.tblAuths || new AuthModel({ db }).init();
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
    getSignDataForWalletAuth: () => this.getSignDataForWalletAuth(),
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

  async add(userId, service, serviceId, details = {}) {
    let auth = await this.tblAuths.findOne({
      where: { service, serviceId },
    });
    if (auth) return auth;
    return this.tblAuths.create({ userId, service, serviceId, details });
  }

  listUserAuthServices(userId) {
    return this.tblAuths.findAll({ userId });
  }

  removeUserAuthService(userId, service) {
    return this.tblAuths.destroy({ userId, service });
  }

  async addPassword(email, password, userId) {
    checkCondition(email, "Must send email.");
    checkCondition(password, "Must send password.");
    const saltHash = await saltAndHash(password);
    const salt = saltHash.salt.toString("base64");
    const hash = saltHash.hash.toString("base64");

    let auth = await this.getByServiceId("email", email);
    if (auth) {
      return this.tblAuths.update(
        { password: { salt, hash } },
        { where: { service: "email", serviceId: email } }
      );
    } else {
      checkCondition(userId, "Must send userId.");
      return this.tblAuths.create({
        userId,
        service: "email",
        serviceId: email,
        password: { salt, hash },
      });
    }
  }

  async getOtpForService(service, serviceId, validDurationInSeconds) {
    validDurationInSeconds =
      validDurationInSeconds || this.config.otpValidateDuration || 600;
    let auth = await this.getByServiceId(
      service,
      serviceId,
      `${serviceId} does not exist.`
    );

    const code = Math.floor(100000 + Math.random() * 900000);
    const expireOn = getUnixTimestamp() + validDurationInSeconds;
    auth.otp = { code, expireOn };
    await auth.save();
    this.emit("otp-created", code, auth);
    return true;
  }

  async getSignDataForWalletAuth(validDurationInSeconds) {
    validDurationInSeconds =
      validDurationInSeconds || this.config.otpValidateDuration || 600;
    return generateDataToSign(this.config.appSecret, validDurationInSeconds);
  }

  async authenticateUsingPassword(email, password) {
    checkCondition(email, "Must send email.");
    checkCondition(password, "Must send password.");

    let auth = await this.tblAuths.findOne({
      where: { service: "email", serviceId: email },
    });

    if (!auth) {
      if (this.config.isDevEnv) {
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
      if (this.config.isDevEnv) {
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

  async authenticateUsingWallet(signature, signPayload) {
    const walletAddress = getAddressFromSignature(
      signature,
      signPayload,
      this.config.appSecret
    );

    let auth = await this.tblAuths.findOne({
      where: { service: "wallet", serviceId: walletAddress },
      attributes: { exclude: ["password"] },
    });

    checkCondition(auth, "Wallet address does not exist.");

    return auth.userId;
  }
};
