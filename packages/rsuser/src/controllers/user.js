const env = require("../env/env");
const { appSecret } = require("../env/env");
const Model = require("../models");
const { ERR, Token } = require("../utils");

const token = new Token({ appSecret });

class User {
  constructor({ db, schema }) {
    let { UserModel } = Model({ db, schema });

    this.UserModel = UserModel;
  }

  add(payload) {
    return this.UserModel.create(payload);
  }

  list() {
    //TODO: enable search filter
    return this.UserModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  remove(id) {
    return this.UserModel.destroy({ where: { id } });
  }

  async updateName(id, name) {
    if (!id) throw ERR.USERID_REQ;
    if (!name) throw ERR.NAME_REQ;
    await this.UserModel.update({ name }, { where: { id } });
    return this.getById(id);
  }

  getById(userId) {
    return this.UserModel.findByPk(userId);
  }
  generateToken(user) {
    const data = {
      userId: user.id,
      name: user.name,
      walletAddress: user.walletAddress,
    };
    const generatedToken = token.generate(data, env.expiryTime);
    return generatedToken;
  }
  validateToken(tokenValue) {
    return token.validate(tokenValue);
  }
}

module.exports = User;
