const AbstractModel = require("@rumsan/utils/lib/abstract/model");
const { DataTypes } = require("sequelize");

const schema = {
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  permissions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  expiryDate: {
    type: DataTypes.DATE,
  },
  isSystem: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

module.exports = class UserModel extends AbstractModel {
  schema = schema;
  constructor() {
    super("tblRoles");
  }
};
