module.exports = class AbstractModel {
  constructor(options) {
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
    return this.db.define(this.tableName, this.schema, {
      timestamps: true,
      freezeTableName: true,
      indexes: this.indexes || [],
    });
  }

  getSchema() {
    return this.schema;
  }
};
