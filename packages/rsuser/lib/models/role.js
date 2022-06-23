const Sequelize = require("sequelize");

module.exports = function ({ db, schema = {}, tableName = "roles" }) {
  schema = {
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    permissions: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    expiry_date: {
      type: Sequelize.DATE,
    },
    is_system: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    ...schema,
  };

  return db.define(tableName, schema, {
    timestamps: true,
  });
};
