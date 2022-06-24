const { User: userSchema } = require("../models");
const { ERR, NameParser } = require("../utils");

let UserModel;
class User {
  constructor({ db }) {
    UserModel = userSchema({ db });
  }

  add(payload) {
    return UserModel.create(payload);
  }

  list() {
    return UserModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  remove(id) {
    return UserModel.destroy({ where: { id } });
  }

  updateName(userId, name, first, last, salutation, suffix, mid) {
    if (!userId) throw ERR.USERID_REQ;
    if (!name) throw ERR.NAME_REQ;
    if (name && typeof name == "string") {
      name = NameParser.parse(name);

      return UserModel.update(
        {
          first: name.first,
          last: name.last,
          salutation: name.salutation,
          suffix: name.sufffx,
          mid: name.mid,
        },
        { where: { id: userId } }
      );
    }
    if (first || last || salutation || suffix || mid) {
    }
  }

  getById(userId) {
    return UserModel.findByPk(userId);
  }
}

module.exports = User;
