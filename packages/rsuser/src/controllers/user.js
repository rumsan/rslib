const { ERR } = require("../utils");

class User {
  constructor({ UserModel }) {
    //let { UserModel } = Model({ db, schema });

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
}

module.exports = User;
