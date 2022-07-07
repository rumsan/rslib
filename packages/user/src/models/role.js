const Sequelize = require("sequelize");

module.exports = function ({ db, schema = {}, tblName }) {
  schema = {
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    permissions: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    expiry_date: {
      type: Sequelize.DATE,
    },
    is_system: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    ...schema,
  };

  return db.define(tblName, schema, {
    timestamps: true,
  });
};