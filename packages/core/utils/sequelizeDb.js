const { loadNodeModule } = require("./core");

class SequelizeDB {
  constructor() {}
  init(database, username, password, options) {
    const { host, dialect, logging, pool } = options;
    const { Sequelize, DataTypes } = loadNodeModule("sequelize");
    this.Sequelize = Sequelize;
    this.DataTypes = DataTypes;
    this.db = new Sequelize(database, username, password, {
      host,
      dialect: dialect || "postgres",
      pool: pool || {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: logging || false,
    });
  }
}

module.exports = new SequelizeDB();
