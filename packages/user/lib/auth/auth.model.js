const AbstractModel = require("@rumsan/utils/lib/abstract/model");
const { AUTH_SERVICE } = require("../../constants");
const { DataTypes } = require("sequelize");

const schema = {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  service: {
    type: DataTypes.ENUM([
      AUTH_SERVICE.EMAIL,
      AUTH_SERVICE.PHONE,
      AUTH_SERVICE.GOOGLE,
      AUTH_SERVICE.APPLE,
      AUTH_SERVICE.FACEBOOK,
      AUTH_SERVICE.GITHUB,
      AUTH_SERVICE.WALLET,
    ]),
    allowNull: false,
  },
  serviceId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.JSON,
    get() {
      return JSON.parse(this.getDataValue("details"));
    },
    set(v) {
      return this.setDataValue("details", JSON.stringify(v));
    },
  },
  password: {
    type: DataTypes.JSON,
    get() {
      return JSON.parse(this.getDataValue("password"));
    },
    set(v) {
      if (!(v.hasOwnProperty("salt") && v.hasOwnProperty("hash")))
        throw ERR.PASSWORD_FORMAT;
      return this.setDataValue("password", JSON.stringify(v));
    },
  },
  falseAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lockedOn: {
    type: DataTypes.DATE,
  },
};

module.exports = class UserModel extends AbstractModel {
  schema = schema;
  constructor() {
    super("tblAuths");
  }
};
