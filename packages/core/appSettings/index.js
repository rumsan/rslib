const Controller = require("./controllers");
const Router = require("./routes");
const Model = require("./model");

class AppSettings {
  async init(db) {
    this.controller = Controller(db);
    Model(db);
    await this.refresh();
  }

  async refresh() {
    this.settings = await this.controller._list();
  }

  getRouter(db, name) {
    return new Router(db, name);
  }

  get(name) {
    if (!name) throw new Error("must send setting name");
    name = name.toUpperCase();
    let settVal = this.settings[name];
    if (!settVal) throw new Error(`AppSetting '${name}' does not exist.`);
    return settVal;
  }
}

module.exports = new AppSettings();
