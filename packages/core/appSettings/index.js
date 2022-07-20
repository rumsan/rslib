const Controller = require("./controllers");
const Router = require("./routes");
const Model = require("./model");

class AppSettings {
  async init(db) {
    this.controller = Controller(db);
    Model(db);
    this.settings = await this.controller._list();
  }

  getRouter(db, name) {
    return new Router(db, name);
  }

  get(name) {
    let settVal = this.SETTINGS[name];
    if (!settVal) throw new Error(`AppSetting '${name}' does not exist.`);
    return settVal;
  }
}

module.exports = new AppSettings();
