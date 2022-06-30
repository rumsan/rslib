const Models = require("./models");
const RoleController = require("./controllers/role");
const UserController = require("./controllers/user");
const AuthController = require("./controllers/auth");
const { ERR, Token } = require("./utils");

class init {
  constructor({ db, schema, notify = null, config }) {
    const { UserModel, RoleModel, AuthModel } = Models({ db, schema, config });
    this.UserModel = UserModel;
    this.RoleModel = RoleModel;
    this.AuthModel = AuthModel;
    this.Role = new RoleController({ db, RoleModel });
    this.User = new UserController({ db, UserModel });
    this.Auth = new AuthController({ db, AuthModel });
    this.tokenHandler = new Token({
      appSecret: config.appSecret,
      jwtDuration: config.jwtDuration,
    });
  }

  generateToken(user) {
    const data = {
      userId: user.id,
      uuid: user.uuid,
      name: user.name,
      walletAddress: user.walletAddress,
    };
    return this.tokenHandler.generate(data);
  }

  validateToken(tokenValue) {
    return this.tokenHandler.validate(tokenValue);
  }
}

module.exports = init;
