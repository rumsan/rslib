const Sequelize = require("sequelize");
const { ERR } = require("../utils");

//Types of login unpw, google, facebook, email, phone, wallet
module.exports = function ({ db, tblName, schema = {} }) {
  schema = {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    service: {
      type: Sequelize.ENUM(["email", "phone", "wallet", "google", "facebook"]),
      allowNull: false,
    },
    serviceId: {
      type: Sequelize.STRING,
      allowNull: false,
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
    details: {
      type: Sequelize.JSON,
      get() {
        return JSON.parse(this.getDataValue("details"));
      },
      set(v) {
        return this.setDataValue("details", JSON.stringify(v));
      },
    },
    false_attempts: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    is_locked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    locked_on: {
      type: Sequelize.DATE,
    },
    ...schema,
  };

  const AuthModel = db.define(tblName, schema, {
    timestamps: true,
    freezeTableName: true,
    index: [
      {
        unique: true,
        fields: ["userId"],
      },
    ],
  });
  return AuthModel;
};
