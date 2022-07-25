const AbstractModel = require("@rumsan/core/abstract/model");
const { DataTypes } = require("sequelize");
const { NameParser } = require("@rumsan/core/utils");

const schema = {
  first: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  initials: {
    type: DataTypes.STRING(10),
  },
  last: {
    type: DataTypes.STRING(255),
  },
  salutation: {
    type: DataTypes.STRING(10),
  },
  suffix: {
    type: DataTypes.STRING(10),
  },
  name: {
    type: DataTypes.STRING(255),
    get() {
      let initials = this.getDataValue("initials")
        ? " " + this.getDataValue("initials")
        : "";
      return (
        this.getDataValue("first") + initials + " " + this.getDataValue("last")
      );
    },
    set(v) {
      let nameParts = NameParser.parse(v);
      this.setDataValue("first", nameParts.first);
      this.setDataValue("last", nameParts.last);
      this.setDataValue("initials", nameParts.initials);
      this.setDataValue("salutation", nameParts.salutation);
      this.setDataValue("suffix", nameParts.suffix);
    },
  },
  gender: {
    type: DataTypes.CHAR(1),
    set(v) {
      this.setDataValue("gender", sanitizeGender(v));
    },
  },
  email: {
    type: DataTypes.TEXT,
    unique: true,
    validate: {
      is: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    },
  },
  phone: {
    type: DataTypes.TEXT,
    set(v) {
      this.setDataValue("phone", v.trim());
    },
  },
  wallet_address: {
    type: DataTypes.STRING,
  },
  roles: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

const sanitizeGender = (gender) => {
  try {
    gender = gender[0].toUpperCase();
    if (gender === "M" || gender === "F") return gender;
    return "O";
  } catch (e) {
    return "U";
  }
};

module.exports = class UserModel extends AbstractModel {
  schema = schema;
  constructor({ db }) {
    super({ db, tableName: "tblUsers" });
  }
};
