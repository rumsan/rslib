const {
  ERR,
  Common: { isUUID },
} = require("../utils");

class User {
  constructor({ UserModel, config = {} }) {
    //let { UserModel } = Model({ db, schema });
    this.config = config;
    this.UserModel = UserModel;
  }

  add(payload) {
    if (this.config.autoApprove) payload.isApproved = true;
    return this.UserModel.create(payload);
  }

  approve(id) {
    return this.UserModel.update({ isApproved: true }, { where: { id } });
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

module.exports = User;
