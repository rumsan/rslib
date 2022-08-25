const AbstractController = require("@rumsan/core/abstract/controller");
const UserModel = require("./user.model");
const AuthController = require("../auth/auth.controllers");
const RoleController = require("../role/role.controllers");
const { RSConfig } = require("@rumsan/core");
const { getUserMixins } = require("./mixins");

const { ERR, ERRNI, throwError, checkCondition } = require("../../error");
const { EVENTS } = require("../../constants");

const {
  TypeUtils: { convertToInteger, isUUID },
  ArrayUtils: { stringToArray },
} = require("@rumsan/core/utils");

class UserController extends AbstractController {
  registrations = {
    signupUsingEmail: (req) => this.signupUsingEmail(req.payload),
    signupUsingWallet: (req) => this.signupUsingWallet(req.payload),
    list: () => this.list(),
    remove: (req) => this.remove(req.params.id),
    getById: (req) => this.getById(req.params.id),
    update: (req) => this.update(req.params.id, req.payload),
    updateEmail: (req) => this.updateEmail(req.params.id, req.payload.email),
    updatePhone: (req) => this.updatePhone(req.params.id, req.payload.phone),
    addRoles: (req) => this.addRoles(req.params.id, req.payload),

    login: (req) =>
      this.loginUsingPassword(req.payload.email, req.payload.password, {
        clientIpAddress: req.info.clientIpAddress,
      }),
    loginUsingOtp: (req) =>
      this.loginUsingOtp(
        req.payload.service,
        req.payload.serviceId,
        req.payload.otp,
        { clientIpAddress: req.info.clientIpAddress }
      ),
    loginUsingWallet: (req) =>
      this.loginUsingWallet(req.payload.signature, req.payload.signPayload, {
        clientIpAddress: req.info.clientIpAddress,
      }),
  };

  /**
   * config options
   * - autoUserApprove: (default:false) need approval before activating the users
   * - enablePasswordAuthentication: must send password  while signing up
   * - ERR: Custom error message package
   */
  constructor(options = {}) {
    options.mixins = Object.assign(getUserMixins(), options.mixins);
    super(options);

    this.table = this.tblUsers =
      this.db.models.tblUsers || new UserModel().init();
    this.authController = options.AuthController || new AuthController();
    this.roleController = options.RoleController || new RoleController();
  }

  async _add(payload) {
    if (RSConfig.get("autoUserApprove")) payload.isApproved = true;
    payload.roles = await this.roleController.filterValidRoleNames(
      payload.roles
    );

    //TODO: use storedproc or atomic tx here
    let newUser = await this.tblUsers.create(payload);
    payload.authPayload.userId = newUser.id;
    let auth = await this.authController.add(payload.authPayload);

    if (
      payload.authPayload.service === "email" ||
      payload.authPayload.service === "phone"
    ) {
      this.emit(
        EVENTS.USER_ADD_OTP,
        auth.otp.code,
        auth.serviceId,
        auth.service,
        newUser
      );
    }
    this.emit(EVENTS.USER_ADD, newUser);
    return newUser;
  }

  approve(id) {
    return this.tblUsers.update({ isApproved: true }, { where: { id } });
  }

  list() {
    //TODO: enable search filter
    return this.tblUsers.findAll({
      order: [["first", "ASC"]],
    });
  }

  remove(id) {
    return this.tblUsers.destroy({ where: { id } });
  }

  /**
   * IMPORTANT: DO NOT OVERWRITE this function. Extend using super.update()
   */
  async update(id, data) {
    if (!id) throwError(ERR.USERID_REQ);
    delete data.email;
    delete data.phone;
    delete data.isApproved;
    delete data.roles;
    delete data.wallet_address;
    await this.tblUsers.update(data, {
      where: { id },
      individualHooks: true,
      returning: true,
    });
    return this.getById(id);
  }

  async updateEmail(id, email) {
    checkCondition(id, ERR.USERID_REQ);
    checkCondition(email, ERR.EMAIL_REQ);
    await this.tblUsers.update(
      { email },
      { where: { id }, individualHooks: true }
    );
    return this.getById(id);
  }

  async updatePhone(id, phone) {
    checkCondition(id, ERR.USERID_REQ);
    checkCondition(phone, ERR.PHONE_REQ);
    await this.tblUsers.update(
      { phone },
      { where: { id }, individualHooks: true }
    );
    return this.getById(id);
  }

  getByUUID(userId) {
    checkCondition(isUUID(userId), "Must send UUID");
    return this.tblUsers.findOne({ where: { uuid: userId } });
  }

  async getById(id, showError = false) {
    let user = await this.tblUsers.findByPk(id);
    if (!user && showError) throwError(ERR.USER_NOEXISTS);
    return user;
  }

  //#region Mixins function signature for auto-complete

  //auth.mixins
  async loginUsingPassword(email, password, { clientIpAddress }) {
    ERRNI();
  }
  setAccessTokenData(data) {
    ERRNI();
  }
  async loginUsingOtp(service, serviceId, otp, { clientIpAddress }) {
    ERRNI();
  }
  async loginUsingWallet(signature, signPayload, { clientIpAddress }) {
    ERRNI();
  }
  //role.mixins
  async addRoles(id, roles) {
    ERRNI();
  }
  async hasRole(id, role) {
    ERRNI();
  }
  //signup.mixins
  async signupUsingEmail(payload) {
    ERRNI();
  }

  async signupUsingWallet(payload) {
    ERRNI();
  }
  //#endregion
}

module.exports = UserController;
