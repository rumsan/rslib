module.exports = ({ db, schema = {}, config = {} }) => {
  /**
   * Define table associations
   */

  let models = {
    UserModel: require("./user")({
      db,
      tblName: "tblUsers",
      schema: schema.user,
      config,
    }),
    RoleModel: require("./role")({
      db,
      tblName: "tblRoles",
      schema: schema.role,
      config,
    }),
    AuthModel: require("./auth")({
      db,
      tblName: "tblAuths",
      schema: schema.auth,
      config,
    }),
  };

  const { tblUsers, tblAuths, tblRoles } = db.models;

  tblUsers.hasMany(tblAuths, {
    foreignKey: "userId",
  });

  return models;
};
