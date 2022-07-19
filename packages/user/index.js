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
  Auth: require("./lib/auth"),
  Role: require("./lib/role"),
  User: require("./lib/user"),

  initModels(db, createAsociations) {
    const _authModel = new this.AuthModel(db).init();
    const _roleModel = new this.RoleModel(db).init();
    const _userModel = new this.UserModel(db).init();

    _createAssociations({ _userModel, _authModel });
    if (createAsociations)
      createAsociations({ _userModel, _authModel, _roleModel });

    return {
      AuthModel: _authModel,
      RoleModel: _roleModel,
      UserModel: _userModel,
    };
  },

  initControllers(db, config) {
    config = {
      ...defaultConfigs,
      ...config,
    };
    return {
      AuthController: new this.AuthController(db, config),
      RoleController: new this.RoleController(db, config),
      UserController: new this.UserController(db, config),
    };
  },
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
