const AbstractController = require("@rumsan/utils/lib/abstract/controller");
const AuthModel = require("./auth.model");

const { ERR, throwError, checkCondition } = require("../../error");
const { AUTH_ACTIONS } = require("../../constants");
const {
  saltAndHash,
  hash,
  generateJwtToken,
} = require("@rumsan/utils/lib/crypto");

/**
 * Any where you want to get user data after the function,
 * call this function for UserController and pass the callback function.
 */

module.exports = class extends AbstractController {
  constructor(db, config, overwrites) {
    super(db, config, overwrites);
    this.table = overwrites?.AuthModel
      ? new overwrites.AuthModel().init(db)
      : new AuthModel().init(db);
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
  };

  manageUsingAction(userId, action, data) {
    if (action === AUTH_ACTIONS.CHANGE_PASSWORD) {
      checkCondition(data.password, "Must send valid password.");
    }
  }

  getById(id) {
    return this.table.findByPk(id);
  }

  async add(userId, service, serviceId, details = {}) {
    let auth = await this.table.findOne({
      where: { service, serviceId },
    });
    if (auth) return auth;
    return this.table.create({ userId, service, serviceId, details });
  }

  listUserAuthServices(userId) {
    return this.table.findAll({ userId });
  }

  removeUserAuthService(userId, service) {
    return this.table.destroy({ userId, service });
  }

  async addPassword(email, password, userId) {
    checkCondition(email, "Must send email.");
    checkCondition(password, "Must send password.");
    const saltHash = await saltAndHash(password);
    const salt = saltHash.salt.toString("base64");
    const hash = saltHash.hash.toString("base64");

    let auth = await this.table.findOne({
      where: { service: "email", serviceId: email },
    });
    if (auth) {
      return this.table.update(
        { password: { salt, hash } },
        { where: { service: "email", serviceId: email } }
      );
    } else {
      checkCondition(userId, "Must send userId.");
      return this.table.create({
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
    checkCondition(callback, "Must send callback function.");

    let auth = await this.table.findOne({
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

    const cbData = await callback(auth.userId);
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
};
