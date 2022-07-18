const AbstractModel = require("@rumsan/utils/lib/abstract/model");
const { DataTypes } = require("DataTypes");

const schema = {
  user_id: { type: ObjectId, required: true, ref: "User" }, //TODO
  name: { type: DataTypes.TEXT, allowNull: false },
  key: { type: DataTypes.TEXT, allowNull: false, unique: true },
  secretHash: { type: DataTypes.TEXT, required: true },
  salt: { type: DataTypes.TEXT, required: true },
  expiryDate: DataTypes.DATE,
  scopes: [{ type: DataTypes.TEXT }],
};

module.exports = class UserModel extends AbstractModel {
  schema = schema;
  constructor() {
    super("tblPats");
  }
};
