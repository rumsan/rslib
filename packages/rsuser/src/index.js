const Models = require("./models");
const {
  RoleController,
  UserController,
  AuthController,
} = require("./controllers");
const { ERR, Token } = require("./utils");

/**
 * config options
 * - appSecret
 * - jwtDuration
 * - autoApprove
 */

class init {
  constructor({ db, schema, notify = null, config }) {
    const { UserModel, RoleModel, AuthModel } = Models({ db, schema, config });
    this.UserModel = UserModel;
    this.RoleModel = RoleModel;
    this.AuthModel = AuthModel;
    this.Role = new RoleController({ db, RoleModel });
    this.User = new UserController({ db, UserModel, config });
    this.Auth = new AuthController({ db, AuthModel, UserModel });
    this.tokenHandler = new Token({
      appSecret: config.appSecret,
      jwtDuration: config.jwtDuration,
    });
  }

  addUser(userPayload) {
    return this.User.add(userPayload);
  }

  //Get user by either id or uuid
  getUserById(userId) {
    return this.User.getById(userId);
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
