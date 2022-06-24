const Sequelize = require("sequelize");

module.exports = function ({ db, schema = {}, tableName = "auth" }) {
  schema = {
    userId: {
      // type:
    },
    type: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      required: true,
      default: false,
    },
    false_attempts: {
      type: Sequelize.NUMBER,
      default: 0,
    },
    is_locked: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    locked_on: {
      type: Sequelize.DATE,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      default: true,
    },
    // created_by: {
    //   type: ObjectId,
    //   ref: modelConfig.User.name,
    // },
    // updated_by: {
    //   type: ObjectId,
    //   ref: modelConfig.User.name,
    // },
    ...schema,
  };

  return db.define(tableName, schema, {
    timestamps: true,
    index: [
      {
        unique: true,
        fields: ["userId"],
      },
    ],
  });
};
