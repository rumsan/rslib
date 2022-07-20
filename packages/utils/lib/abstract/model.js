module.exports = class AbstractModel {
  constructor(db, tableName) {
    if (this.constructor == AbstractModel) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    if (!db)
      throw new Error("AbstractModel: Must send valid sequelize db reference.");
    if (!tableName) throw new Error("AbstractModel: Must send table name.");
    this.tableName = tableName;
    this.db = db;
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
