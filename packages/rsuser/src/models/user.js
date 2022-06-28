const Sequelize = require("sequelize");
const { NameParser, RSError, ERR } = require("../utils");

module.exports = function ({ db, schema = {} }) {
  schema = {
    first: {
      type: Sequelize.TEXT,
    },
    mid: {
      type: Sequelize.TEXT,
    },
    last: {
      type: Sequelize.TEXT,
    },
    salutation: {
      type: Sequelize.TEXT,
    },
    suffix: {
      type: Sequelize.TEXT,
    },
    email: {
      type: Sequelize.TEXT,
      validate: {
        is: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      },
    },
    name: {
      type: Sequelize.VIRTUAL,
      get() {
        let initials = this.initials ? " " + this.initials : "";
        return this.first + initials + " " + this.last;
      },
      set(v) {
        let { first, initials, last, suffix, salutation } = NameParser.parse(v);
        this.first = first;
        this.mid = initials;
        this.last = last;
        this.suffix = suffix;
        this.salutation = salutation;
      },
    },
    phone: {
      type: Sequelize.TEXT,
      set(v) {
        this.setDataValue("phone", v.trim());
      },
    },
    gender: {
      type: Sequelize.CHAR(1),
      set(v) {
        this.setDataValue("gender", sanitizeGender(v));
      },
    },
    password: {
      type: Sequelize.JSON,
      validate: {
        customValidator(v) {
          if (!(v.hasOwnProperty("salt") && v.hasOwnProperty("hash")))
            throw ERR.PASSWORD_FORMAT;
        },
      },
    },
    wallet_address: {
      type: Sequelize.TEXT,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      default: true,
    },
    ...schema,
  };

  const UserModel = db.define("users", schema, {
    freezeTableName: true,
    timestamps: true,
  });

  // UserModel.associate = function (models) {
  //   UserModel.hasMany(models.Auth);
  // };
  return UserModel;
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
