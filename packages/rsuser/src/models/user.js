const { DataTypes } = require("sequelize");
const { NameParser, RSError, ERR } = require("../utils");

module.exports = function ({ db, schema = {} }) {
  schema = {
    // uuid: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   defaultValue: DataTypes.UUIDV4,
    // },
    first: {
      type: DataTypes.TEXT,
    },
    mid: {
      type: DataTypes.TEXT,
    },
    last: {
      type: DataTypes.TEXT,
    },
    salutation: {
      type: DataTypes.TEXT,
    },
    suffix: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.TEXT,
      validate: {
        is: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      },
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    name: {
      type: DataTypes.VIRTUAL,
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
      // type: DataTypes.JSON,
      // get() {
      //   return JSON.parse(this.getDataValue("name"));
      // },
      // set(v) {
      //   let parsed = NameParser.parse(v);
      //   return this.setDataValue("name", JSON.stringify(parsed));
      // },
    },
    phone: {
      type: DataTypes.TEXT,
      set(v) {
        this.setDataValue("phone", v.trim());
      },
    },
    gender: {
      type: DataTypes.CHAR(1),
      set(v) {
        this.setDataValue("gender", sanitizeGender(v));
      },
    },
    walletAddress: {
      type: DataTypes.STRING,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ...schema,
  };
  const UserModel = db.define("tblUsers", schema, {
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  });

  // UserModel.associate = function (models) {
  //   UserModel.hasMany(db.models.auth, {
  //     foreignKey: {
  //       name: "userId",
  //       allowNull: false,
  //     },
  //     as: "auths",
  //   });
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
