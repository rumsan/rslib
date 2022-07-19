const AbstractController = require("@rumsan/utils/lib/abstract/controller");
const UserModel = require("./user.model");
const AuthController = require("../auth/auth.controllers");
const RoleController = require("../role/role.controllers");

const { ERR, throwError, checkCondition } = require("../../error");

const {
  DataTypes: { convertToInteger, isUUID },
  ArrayUtils: { stringToArray },
} = require("@rumsan/utils");

module.exports = class extends AbstractController {
  registrations = {
    add: (req) => this.signupUsingEmail(req.payload),
    login: (req) =>
      this.authUsingPassword(req.payload.email, req.payload.password),
    list: () => this.list(),
    remove: (req) => this.remove(req.params.id),
    getById: (req) => this.getById(req.params.id),
    update: (req) => this.update(req.params.id, req.payload),
    updateEmail: (req) => this.updateEmail(req.params.id, req.payload.email),
    updatePhone: (req) => this.updatePhone(req.params.id, req.payload.phone),
    addRoles: (req) => this.addRoles(req.params.id, req.payload),
  };

  /**
   * config options
   * - autoApprove: (default:false) need approval before activating the users
   * - enablePasswordAuthentication: must send password  while signing up
   * - ERR: Custom error message package
   */
  constructor(db, config) {
    super(db, config);
    this.table = this.tblUsers = db.models.tblUsers || new UserModel(db).init();
    this.authController = new AuthController(db, config);
    this.roleController = new RoleController(db, config);
  }

  async _add(payload) {
    if (this.config.autoApprove) payload.isApproved = true;
    payload.roles = await this.roleController.listValidRoleNames(payload.roles);
    return this.tblUsers.create(payload);
  }

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
   * IMPORTANT: DO NOT OVERWRITE this function use super.update()
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

  async authUsingPassword(email, password, callback) {
    if (!this.config.enablePasswordAuthentication)
      throw new Error(
        "Cannot login using password when enablePasswordAuthentication is false"
      );

    let defaultCallback = async (userId) => {
      let user = await this.getById(userId);
      let permissions = await this.roleController.calculatePermissions(
        user.roles
      );

      if (callback) return callback(user, permissions);
      else
        return {
          user: { id: user.id, name: user.name },
          permissions,
        };
    };
    return this.authController.authenticateUsingPassword(
      email,
      password,
      defaultCallback
    );
  }

  async addRoles(id, roles) {
    roles = stringToArray(roles);
    let user = await this.getById(id, true);

    //TODO: filter to only valid roles
    //let role = await this.getByName(name);
    user.roles = user.roles || [];
    roles = [...new Set([...roles, ...user.roles])];

    user = await this.tblUsers.update(
      { roles },
      { where: { id }, individualHooks: true, returning: true }
    );
    return user[1][0];
  }

  // async hasRole(id, role) {
  //   let role = await this.tblUsers.findOne({ where: { name } });
  //   if (!role) return false;
  //   return role.permissions.indexOf(permission) > -1;
  // }

  // async removeRoles(id, roles) {
  //   let role = await this.getByName(name);
  //   checkCondition(role, ERR.ROLE_NOEXISTS);
  //   checkCondition(!role.isSystem, ERR.ROLE_ISSYSTEM);

  //   roles = stringToArray(roles);
  //   permissions = role.permissions.filter(
  //     (item) => !permissions.includes(item)
  //   );
  //   await this.tblUsers.update(
  //     { permissions },
  //     { where: { name, isSystem: false } }
  //   );

  //   return this.getByName(name);
  // }
};
