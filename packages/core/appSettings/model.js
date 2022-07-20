const { loadNodeModule } = require("../utils/core");

module.exports = (db) => {
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

  return db.define("tblAppSettings", schema, {
    timestamps: true,
    freezeTableName: true,
  });
};
