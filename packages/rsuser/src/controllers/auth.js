const {
  ERR,
  Secure: { saltAndHash, hash },
} = require("../utils");

class Auth {
  constructor({ AuthModel, UserModel }) {
    this.UserModel = UserModel;
    this.AuthModel = AuthModel;
  }

  async add(userId, service, serviceId, details = {}) {
    let auth = await this.AuthModel.findOne({
      where: { service, serviceId },
    });
    if (!auth) return auth;
    return this.AuthModel.create({ userId, service, serviceId, details });
  }

  async addPassword(email, password) {
    let auth = await this.AuthModel.findOne({
      where: { service: "email", serviceId: email },
    });
    if (!auth) throw new Error("User auth not found.");

    const saltHash = await saltAndHash(password);
    const salt = saltHash.salt.toString("base64");
    const hash = saltHash.hash.toString("base64");
    return this.AuthModel.update(
      { details: { salt, hash } },
      { where: { service: "email", serviceId: email } }
    );
  }

  async authenticateUsingPassword(email, password) {
    let auth = await this.AuthModel.findOne({
      where: { service: "email", serviceId: email },
    });

    if (!auth) throw ERR.USER_NOEXISTS;
    const hashedPwd = await hash(
      password,
      Buffer.from(auth.details.salt, "base64")
    );

    if (auth.details.hash !== hashedPwd.hash.toString("base64"))
      throw ERR.LOGIN_INVALID;

    return this.UserModel.findByPk(auth.userId);
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
    if (isUUID(userId))
      return this.UserModel.findOne({ where: { uuid: userId } });
    else return this.UserModel.findByPk(userId);
  }
}

module.exports = Auth;
