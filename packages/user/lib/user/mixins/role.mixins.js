const { throwError, ERR } = require("../../../error");

module.exports = {
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
  },

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
