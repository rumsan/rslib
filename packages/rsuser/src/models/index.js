module.exports = ({ db, schema = {}, config = {} }) => {
  return {
    UserModel: require("./user")({
      db,
      schema: schema.user,
      config,
    }),
    RoleModel: require("./role")({
      db,
      schema: schema.role,
      config,
    }),
    //PAT: require("./pat")({ db, schema: schema.pat, User }),
    AuthModel: require("./auth")({
      db,
      schema: schema.auth,
      config,
    }),
  };
};
