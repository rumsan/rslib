const Sequelize = require("sequelize");

module.exports = function ({ db, schema = {} }) {
  schema = {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    type: {
      type: Sequelize.TEXT,
    },
    username: {
      type: Sequelize.TEXT,
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

  const AuthModel = db.define("tblAuths", schema, {
    timestamps: true,
    freezeTableName: true,
    index: [
      {
        unique: true,
        fields: ["userId"],
      },
    ],
  });

  // AuthModel.associate = function (models) {
  //   AuthModel.belongsTo(db.models.user, {
  //     foreignKey: {
  //       name: "userId",
  //       allowNull: false,
  //     },
  //   });
  // };

  return AuthModel;
};
