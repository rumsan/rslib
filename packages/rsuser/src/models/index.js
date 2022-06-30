module.exports = ({ db, schema = {}, sequelize, ...props }) => {
  return {
    UserModel: require("./user")({
      db,
      schema: schema.user,
      sequelize,
      ...props,
    }),
    RoleModel: require("./role")({
      db,
      schema: schema.role,
      sequelize,
      ...props,
    }),
    //PAT: require("./pat")({ db, schema: schema.pat, User }),
    AuthModel: require("./auth")({
      db,
      schema: schema.auth,
      sequelize,
      ...props,
    }),
  };
};
