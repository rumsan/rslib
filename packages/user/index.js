const { EVENTS, PERMISSIONS } = require("./constants");

module.exports = {
  RSU_EVENTS: EVENTS,
  RSU_PERMISSIONS: PERMISSIONS,
  AuthController: require("./lib/auth/auth.controllers"),
  RoleController: require("./lib/role/role.controllers"),
  UserController: require("./lib/user/user.controllers"),
  AuthValidator: require("./lib/auth/auth.validators"),
  RoleValidator: require("./lib/role/role.validators"),
  UserValidator: require("./lib/user/user.validators"),
  AuthModel: require("./lib/auth/auth.model"),
  RoleModel: require("./lib/role/role.model"),
  UserModel: require("./lib/user/user.model"),
  AuthRouter: require("./lib/auth/auth.router"),
  RoleRouter: require("./lib/role/role.router"),
  UserRouter: require("./lib/user/user.router"),

  initModels(createAsociations) {
    const _authModel = new this.AuthModel().init();
    const _roleModel = new this.RoleModel().init();
    const _userModel = new this.UserModel().init();

    _createAssociations({ _userModel, _authModel });
    if (createAsociations) {
      createAsociations({ _userModel, _authModel, _roleModel });
    }

    return {
      AuthModel: _authModel,
      RoleModel: _roleModel,
      UserModel: _userModel,
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
