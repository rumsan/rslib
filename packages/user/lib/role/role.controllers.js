const { Op } = require("sequelize");
const sequelize = require("sequelize");

const AbstractController = require("@rumsan/utils/lib/abstract/controller");
const RoleModel = require("./role.model");
const { ERR, checkCondition } = require("../../error");

const stringToArray = (value) => {
  if (typeof value == "string") return value.split(",");
  else return value || [];
};

module.exports = class extends AbstractController {
  registrations = {
    add: (req) => this.add(req.payload),
    list: () => this.list(),
    remove: (req) => this.remove(req.params.name),
    get: (req) => this.getByName(req.params.name),
    addPermissions: (req) => this.addPermissions(req.params.name, req.payload),
    removePermissions: (req) =>
      this.removePermissions(req.params.name, req.payload),
  };

  constructor(db, config, overwrites) {
    super(db, config, overwrites);
    this.table = overwrites?.RoleModel
      ? new overwrites.RoleModel().init(db)
      : new RoleModel().init(db);
  }

  getById(id) {
    return this.table.findByPk(id);
  }

  getByName(name) {
    checkCondition(name, ERR.ROLE_NAME_REQ);
    return this.table.findOne({ where: { name } });
  }

  list() {
    return this.table.findAll({
      order: [["name", "ASC"]],
    });
  }

  async listPermissions(name) {
    let role = await this.table.findOne({ where: { name } });
    return role.permissions;
  }

  async getValidRoles() {
    let roles = await this.table.findAll({
      where: {
        [Op.or]: [
          {
            expiryDate: null,
          },
          {
            expiryDate: {
              [Op.gt]: new Date(),
            },
          },
        ],
      },
      order: [["name", "ASC"]],
    });

    return roles.map((r) => r.name);
  }

  async checkForValidRoles(roles) {
    if (typeof roles == "string") roles = roles.split(",");
    let validRoles = await this.getValidRoles();
    return roles.every((r) => {
      return validRoles.includes(r);
    });
  }

  /*************** Write Functions **************/

  /**
   * Role add
   * NOTICE: DO NOT send isSystem from user-end application. It is reserved for deployment only.
   */
  async add(payload = {}) {
    checkCondition(payload.name, ERR.ROLE_NAME_REQ);
    let role = await this.table.findOne({ where: { name: payload.name } });
    payload.permissions = stringToArray(payload.permissions);

    if (role) {
      checkCondition(!role.isSystem, ERR.ROLE_ISSYSTEM);
      if (role.isSystem) return role;
      let permissions = [
        ...new Set([...payload.permissions, ...role.permissions]),
      ];
      return this.addPermissions(payload.name, permissions, true);
    } else {
      payload.isSystem = false;
      return this.table.create(payload);
    }
  }

  remove(name) {
    return this.table.destroy({ where: { name, isSystem: false } });
  }

  async addPermissions(name, permissions, overwrite = false) {
    permissions = stringToArray(permissions);

    if (!overwrite) {
      let role = await this.getByName(name);
      checkCondition(role, ERR.ROLE_NOEXISTS);
      checkCondition(!role.isSystem, ERR.ROLE_ISSYSTEM);
      permissions = [...new Set([...permissions, ...role.permissions])];
    }

    await this.table.update(
      { permissions },
      { where: { name, isSystem: false } }
    );
    return this.getByName(name);
  }

  async hasPermission(name, permission) {
    let role = await this.table.findOne({ where: { name } });
    if (!role) return false;
    return role.permissions.indexOf(permission) > -1;
  }

  async removePermissions(name, permissions) {
    let role = await this.getByName(name);
    checkCondition(role, ERR.ROLE_NOEXISTS);
    checkCondition(!role.isSystem, ERR.ROLE_ISSYSTEM);

    permissions = stringToArray(permissions);
    permissions = role.permissions.filter(
      (item) => !permissions.includes(item)
    );
    await this.table.update(
      { permissions },
      { where: { name, isSystem: false } }
    );

    return this.getByName(name);
  }
};
