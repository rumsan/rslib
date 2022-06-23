const { Model } = require("sequelize");
const Sequelize = require("sequelize");
// const sequelize = new Sequelize("sqlite::memory:");

module.exports = function ({ db, modelConfig }) {
  schema = modelConfig?.User?.schema || {};

  // the very basic user schema
  const UserSchemaBase = {
    name: {
      first: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last: {
        type: Sequelize.STRING,
      },
      salutation: {
        type: Sequelize.STRING,
      },
      suffix: {
        type: Sequelize.STRING,
      },
      get() {
        if (this.name.initials)
          return (
            this.name.first + " " + this.name.initials + " " + this.name.last
          );
        else return this.name.first + " " + this.name.last;
      },
    },
    email: {
      type: Sequelize.STRING,
      get() {
        try {
          if (this.email.length == 0) return null;
          let email = this.email;
          if (email) return email.address;

          email = this.email.find((e) => {
            return e.type === "email";
          });
          if (email) return email.address;
        } catch (e) {
          return null;
        }
      },
    },
    phone: {
      type: Sequelize.STRING,
      get() {
        return this.phone.trim();
      },
    },
  };

  //   const userSchemaVirtuals = {};

  const userSchemaMain = {
    ...UserSchemaBase,
    ...schema,
    // userSchemaVirtuals,
  };

  const UserSchema = db.define("user", userSchemaMain, {
    timestamps: true,
  });
  //   (async () => {
  //     await sequelize.sync({ force: true });
  //     // Code here
  //   })();

  return UserSchema;
};

// class User extends Model{

// }

// User.init({})
