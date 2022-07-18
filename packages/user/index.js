const defaultConfigs = {
  isDevEnv: false,
  appSecret: null,
  jwtDuration: 1200000,
  enablePasswordAuthentication: false, //enable authentication using password
  autoApprove: false, //auto approves user after they are added
};

module.exports = {
  AuthController: require("./lib/auth/auth.controllers"),
  RoleController: require("./lib/role/role.controllers"),
  UserController: require("./lib/user/user.controllers"),
  AuthValidator: require("./lib/auth/auth.validators"),
  RoleValidator: require("./lib/role/role.validators"),
  UserValidator: require("./lib/user/user.validators"),
  AuthModel: require("./lib/auth/auth.model"),
  RoleModel: require("./lib/role/role.model"),
  UserModel: require("./lib/user/user.model"),

  initModels(db, { UserModel, RoleModel, AuthModel, createAsociations } = {}) {
    this.AuthModel = AuthModel || this.AuthModel;
    this.RoleModel = RoleModel || this.RoleModel;
    this.UserModel = UserModel || this.UserModel;
    const _authModel = new this.AuthModel().init(db);
    const _roleModel = new this.RoleModel().init(db);
    const _userModel = new this.UserModel().init(db);

    _createAssociations({ _userModel, _authModel });
    if (createAsociations)
      createAsociations({ _userModel, _authModel, _roleModel });

    return {
      AuthModel: _authModel,
      RoleModel: _roleModel,
      UserModel: _userModel,
    };
  },

  register(db, config, overwrites) {
    config = {
      ...defaultConfigs,
      ...config,
    };

    return {
      User: (app, name) =>
        _registerModule("./lib/user", db, app, name, config, overwrites),
      Role: (app, name) =>
        _registerModule("./lib/role", db, app, name, config, overwrites),
    };
  },
};

const _registerModule = (modulePath, db, app, name, config, overwrites) => {
  let mdl = require(modulePath);
  mdl = new mdl(db, name, config, overwrites);
  return mdl.register(app);
};

const _createAssociations = ({ _userModel, _authModel }) => {
  _authModel.belongsTo(_userModel, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  _userModel.hasMany(_authModel, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
};
