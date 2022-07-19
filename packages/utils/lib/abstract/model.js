module.exports = class AbstractController {
  constructor(tableName) {
    if (this.constructor == AbstractController) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    if (!tableName) throw new Error("Must send table name.");
    this.tableName = tableName;
  }

  schema = {};

  addSchema(schema) {
    this.schema = { ...this.schema, ...schema };
  }

  init(db) {
    return db.define(this.tableName, this.schema, {
      timestamps: true,
      freezeTableName: true,
      indexes: this.indexes || [],
    });
  }
};
