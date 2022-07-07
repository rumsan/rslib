const Models = require("./models");
const {
  RoleController,
  UserController,
  AuthController,
} = require("./controllers");
const Utils = require("./utils");
/**
 * config options
 * - appSecret
 * - jwtDuration
 * - autoApprove
 * - appSignatureValidity
 * - w3PrivateKey
 */

class init {
  constructor(db, { schema, notify = null, config }) {
    Models({ db, schema, config });

    this.Role = new RoleController(db, { config });
    this.User = new UserController(db, { config });
    this.Auth = new AuthController(db, {
      config,
      WalletUtils: this.walletUtils,
    });
    this.utilities = Utils;
    this.tokenHandler = new this.utilities.Token({
      appSecret: config.appSecret,
      jwtDuration: config.jwtDuration,
    });
    this.walletUtils = new this.utilities.WalletUtils({ config });
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
    if (!wallet_address) throw this.utilities.ERR.WALLET_REGISTER_FAILED;

    try {
      let user = await this.UserModel.findOne({ wallet_address });
      if (user) throw this.utilities.ERR.USERNAME_EXISTS;
      else {
        user = await this.UserModel.create({ walletAddress, ...payload });
        const token = await this.generateToken(user);
        return { user, token };
      }
    } catch (error) {
      this.utilities.ERR.DEFAULT;
    }
  }
}

module.exports = init;
