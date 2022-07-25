const AbstractModel = require("@rumsan/core/abstract/model");
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
      AUTH_SERVICE.TWITTER,
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
  otp: {
    type: DataTypes.JSON,
    get() {
      return JSON.parse(this.getDataValue("otp"));
    },
    set(v) {
      if (!(v.hasOwnProperty("code") && v.hasOwnProperty("expireOn")))
        throw new Error("OTP must send code and expireOn");
      return this.setDataValue("otp", JSON.stringify(v));
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
  indexes = [
    {
      unique: true,
      fields: ["service", "serviceId"],
      name: "unique_service",
    },
  ];
  constructor({ db }) {
    super({ db, tableName: "tblAuths" });
  }
};
