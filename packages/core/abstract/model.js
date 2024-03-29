const SequelizeDB = require("../utils/sequelizeDb");

module.exports = class AbstractModel {
  constructor(options) {
    this.db = SequelizeDB.db;
    if (this.constructor == AbstractModel) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    Object.assign(this, options);
    if (!this.db)
      throw new Error("AbstractModel: Must send valid sequelize db reference.");
    if (!this.tableName)
      throw new Error("AbstractModel: Must send table name.");
  }

  schema = {};

  addSchema(schema) {
    this.schema = { ...this.schema, ...schema };
  }

  init() {
    return this.db.define(this.tableName, this.getSchema(), {
      timestamps: true,
      freezeTableName: true,
      indexes: this.indexes || [],
    });
  }

  getSchema() {
    return {
      ...this.schema,
      ...{
        createdBy: { type: SequelizeDB.DataTypes.INTEGER },
        updatedBy: { type: SequelizeDB.DataTypes.INTEGER },
      },
    };
  }
};
