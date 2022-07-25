const { Op } = require("sequelize");
const sequelize = require("sequelize");

const AbstractController = require("@rumsan/core/abstract/controller");
const RoleModel = require("./role.model");
const { ERR, checkCondition } = require("../../error");

const {
  ArrayUtils: { stringToArray },
} = require("@rumsan/core/utils");

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

  constructor(options) {
    const { db } = options;
    super(options);
    this.table = this.tblRoles =
      db.models.tblRoles || new RoleModel({ db }).init();
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

  async listValidRoles(filterRoles) {
    let roles = stringToArray(filterRoles);
    let where = {
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
    };
    if (roles.length) where.name = roles;
    return this.table.findAll({
      where,
      order: [["name", "ASC"]],
    });
  }

  async listValidRoleNames(filterRoles) {
    let validRoles = await this.listValidRoles(filterRoles);
    return validRoles.map((r) => r.name);
  }

  async calculatePermissions(roles) {
    if (!roles) return [];
    let validRoles = await this.listValidRoles(roles);
    let perms = [];
    validRoles.forEach((r) => {
      perms = [...new Set([...perms, ...r.permissions])];
    });
    return perms;
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
      this.emit("permission_add", {
        name: payload.name,
        permissions,
        isSystem: false,
      });
      return this.addPermissions(payload.name, permissions, true);
    } else {
      payload.isSystem = false;
      this.emit("add", payload);
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
