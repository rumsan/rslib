const Sequelize = require("sequelize");

module.exports = function ({ db, schema = {}, tableName = "pats" }) {
  schema = {
    user_id: { type: ObjectId, required: true, ref: "User" }, //TODO
    name: { type: Sequelize.TEXT, allowNull: false },
    key: { type: Sequelize.TEXT, allowNull: false, unique: true },
    secretHash: { type: Sequelize.TEXT, required: true },
    salt: { type: Sequelize.TEXT, required: true },
    expiry_date: Sequelize.DATE,
    scopes: [{ type: Sequelize.TEXT }],
    ...schema,
  };

  return db.define(tableName, schema, {
    timestamps: true,
  });
};
