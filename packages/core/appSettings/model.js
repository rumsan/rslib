const { loadNodeModule } = require("../utils/core");
const SequelizeDB = require("../utils/sequelizeDb");

module.exports = () => {
  loadNodeModule("pg");
  loadNodeModule("pg-hstore");
  const { DataTypes } = loadNodeModule("sequelize");

  const schema = {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.JSON,
      get() {
        return JSON.parse(this.getDataValue("value"));
      },
      set(v) {
        if (!v.hasOwnProperty("data"))
          throw new Error("Must pass data property");
        return this.setDataValue("value", JSON.stringify(v));
      },
      allowNull: false,
    },
    requiredFields: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    isReadOnly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  };

  return SequelizeDB.db.define("tblAppSettings", schema, {
    timestamps: true,
    freezeTableName: true,
  });
};
