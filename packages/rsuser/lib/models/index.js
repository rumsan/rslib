module.exports = ({ db, schema = {} }) => {
  return {
    UserModel: require("./user")({ db, schema: schema.user }),
    RoleModel: require("./role")({ db, schema: schema.role }),
    //PAT: require("./pat")({ db, schema: schema.pat, User }),
    AuthModel: require("./auth")({ db, schema: schema.auth }),
  };
};
