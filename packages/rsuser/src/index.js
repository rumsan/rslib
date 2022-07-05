const Models = require("./models");
const {
  RoleController,
  UserController,
  AuthController,
} = require("./controllers");
const { ERR, Token, WalletUtils } = require("./utils");
/**
 * config options
 * - appSecret
 * - jwtDuration
 * - autoApprove
 * - appSignatureValidity
 * - w3PrivateKey
 */

class init {
  constructor({ db, schema, notify = null, config }) {
    const { UserModel, RoleModel, AuthModel } = Models({ db, schema, config });

    this.UserModel = UserModel;
    this.RoleModel = RoleModel;
    this.AuthModel = AuthModel;
    this.Role = new RoleController({ db, RoleModel });
    this.User = new UserController({ db, UserModel, config });
    this.Auth = new AuthController({
      db,
      AuthModel,
      UserModel,
      WalletUtils: this.walletUtils,
    });
    this.tokenHandler = new Token({
      appSecret: config.appSecret,
      jwtDuration: config.jwtDuration,
    });
    this.walletUtils = new WalletUtils({ config });
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
      wallet_address: user.wallet_address,
    };
    return this.tokenHandler.generate(data);
  }

  validateToken(tokenValue) {
    return this.tokenHandler.validate(tokenValue);
  }

  async walletRegister({ authSignature, ...payload }) {
    let wallet_address = await this.WalletUtils.getAddressFromSignature(
      authSignature
    );
    if (!wallet_address) throw ERR.WALLET_REGISTER_FAILED;

    try {
      let user = await this.UserModel.findOne({ wallet_address });
      if (user) throw ERR.USERNAME_EXISTS;
      else {
        user = await this.UserModel.create({ walletAddress, ...payload });
        const token = await this.generateToken(user);
        return { user, token };
      }
    } catch (error) {
      ERR.DEFAULT;
    }
  }
}

module.exports = init;
