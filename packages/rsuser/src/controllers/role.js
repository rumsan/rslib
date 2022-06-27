const { Op } = require("sequelize");
const Model = require("../models");
const sequelize = require("sequelize");

function arrayContainsArray(superset, subset) {
  if (0 === subset.length || superset.length < subset.length) {
    return false;
  }
  for (var i = 0; i < subset.length; i++) {
    if (superset.indexOf(subset[i]) === -1) return false;
  }
  return true;
}

class Role {
  constructor({ db, schema }) {
    let { RoleModel } = Model({ db, schema: schema?.user });
    this.RoleModel = RoleModel;
  }
  get(id) {
    return this.RoleModel.findByPk(id);
  }

  async add(payload) {
    let role = await this.RoleModel.findOne({ where: { name: payload.name } });

    if (role) {
      if (role.is_system) return role;
      return this.addPermission({
        name: payload.name,
        permissions: payload.permissions,
      });
    } else {
      return this.RoleModel.create(payload);
    }
  }

  list() {
    return this.RoleModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  remove(id) {
    return this.RoleModel.destroy({ where: { id, is_system: false } });
  }

  async listPermissions(name) {
    let role = await this.RoleModel.findOne({ where: { name } });
    return role.permissions;
  }

  async getValidRoles() {
    let roles = await this.RoleModel.findAll({
      where: {
        [Op.or]: [
          {
            expiry_date: null,
          },
          {
            expiry_date: {
              [Op.gt]: new Date(),
            },
          },
        ],
      },
      order: [["name", "ASC"]],
    });

    return roles.map((r) => r.name);
  }

  async isValidRole(roles) {
    if (typeof roles == "string") roles = roles.split(",");
    let vroles = await this.getValidRoles();
    return arrayContainsArray(vroles, roles);
  }

  async calculatePermissions(name) {
    if (!name) return [];
    let roles = name;
    if (typeof name == "string") roles = name.split(",");

    let validRoles = await this.RoleModel.findAll({
      where: {
        //todo: "name" and figure out what the function does
        [Op.or]: [
          {
            expiry_date: null,
          },
          {
            expiry_date: {
              [Op.gt]: new Date(),
            },
          },
        ],
      },
    });

    // let validRoles = await this.RoleModel.find({
    //   name: { $in: roles },
    //   $or: [{ expiry_date: null }, { expiry_date: { $gt: new Date() } }],
    // });

    let perms = [];
    validRoles.forEach((r) => {
      perms = [...new Set([...perms, ...r.permissions])];
    });
    return perms;
  }

  // async getPermissions(name) {
  //   let role = await this.RoleModel.findOne({ where: { name } });
  //   return role.permissions;
  // },

  async getRoleByName(name) {
    return this.RoleModel.findOne({ where: { name } });
  }

  async addPermission({ name, permissions }) {
    permissions = permissions || [];
    if (typeof permissions == "string") permissions = permissions.split(",");

    await this.RoleModel.update(
      {
        permissions: sequelize.fn(
          "array_cat",
          sequelize.col("permissions"),
          permissions
        ),
      },
      { where: { name } }
    );
    return this.getRoleByName(name);
  }

  async hasPermission({ name, permission }) {
    let role = await this.RoleModel.findOne({ where: { name } });
    if (!role) return false;
    return role.permissions.indexOf(permission) > -1;
  }

  async removePermission({ id, permissions }) {
    await this.RoleModel.update(
      {
        permissions: sequelize.fn(
          "array_remove",
          sequelize.col("permissions"),
          permissions
        ),
      },
      { where: { id, is_system: false } }
    );

    return this.get(id);
  }
}

module.exports = Role;
