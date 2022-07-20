const AbstractController = require("@rumsan/core/abstract/controller");
const AuthModel = require("./auth.model");

const { ERR, throwError, checkCondition } = require("../../error");
const { AUTH_ACTIONS } = require("../../constants");
const {
  saltAndHash,
  hash,
  generateJwtToken,
} = require("@rumsan/core/utils/cryptoUtils");

/**
 * Any where you want to get user data after the function,
 * call this function for UserController and pass the callback function.
 */

module.exports = class extends AbstractController {
  constructor(db, config) {
    super(db, config);
    this.table = this.tblAuths = db.models.tblAuths || new AuthModel(db).init();
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

  async authenticateUsingPassword(email, password, callback) {
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

    return this._afterAuthenticate(auth.userId, callback);

    // const cbData = await callback(auth.userId);
    // checkCondition(cbData, "Must callback data with user and permissions.");

    // checkCondition(
    //   cbData.user,
    //   "Must send user object in authenticate callback."
    // );

    // checkCondition(
    //   cbData.user.id,
    //   "Must send user.id in authenticate callback."
    // );

    // checkCondition(
    //   cbData.permissions && Array.isArray(cbData.permissions),
    //   "Must send permissions array in authenticate callback."
    // );

    // cbData.accessToken = generateJwtToken(
    //   {
    //     user: cbData.user,
    //     permissions: cbData.permissions,
    //     userId: cbData.user.id,
    //   },
    //   this.config.appSecret,
    //   this.config.jwtDuration
    // );

    // return cbData;
  }

  async _afterAuthenticate(userId, callback) {
    checkCondition(callback, "Must send callback function.");
    const cbData = await callback(userId);
    checkCondition(cbData, "Must callback data with user and permissions.");

    checkCondition(
      cbData.user,
      "Must send user object in authenticate callback."
    );

    checkCondition(
      cbData.user.id,
      "Must send user.id in authenticate callback."
    );

    checkCondition(
      cbData.permissions && Array.isArray(cbData.permissions),
      "Must send permissions array in authenticate callback."
    );

    cbData.accessToken = generateJwtToken(
      {
        user: cbData.user,
        permissions: cbData.permissions,
        userId: cbData.user.id,
      },
      this.config.appSecret,
      this.config.jwtDuration
    );

    return cbData;
  }

  async getOtpForService(service, serviceId) {
    let auth = await this.getByServiceId(
      service,
      serviceId,
      `${serviceId} does not exist.`
    );

    const code = Math.floor(100000 + Math.random() * 900000);
    const expireOn = new Date(new Date().getTime() + 10 * 60000); //10 minutes later
    auth.otp = { code, expireOn };
    await auth.save();
    auth = JSON.stringify(auth);
    auth = JSON.parse(auth);
    delete auth.password;
    delete auth.createdAt;
    delete auth.updatedAt;
    this.emit("otp_created", code, auth);
    return code;
  }

  async authenticateUsingOtp(service, serviceId, otp, callback) {
    let auth = await this.getByServiceId(
      service,
      serviceId,
      `${serviceId} does not exist.`
    );

    checkCondition(auth.otp, "Invalid OTP");
    checkCondition(auth.otp.code, "Invalid OTP");
    checkCondition(auth.otp.code === otp, "Invalid OTP sent");
    checkCondition(
      new Date() < new Date(auth.otp.expireOn),
      "OTP has expiread"
    );
    return this._afterAuthenticate(auth.userId, callback);
  }
};
