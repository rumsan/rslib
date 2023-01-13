const Controller = require("./controller");
const Router = require("./routes");
const Model = require("./model");

class AppSettings {
  async init() {
    this.controller = Controller();
    await this.refresh();
  }

  async refresh() {
    this.settings = await this.controller._list();
  }

  get(name) {
    if (!name) throw new Error("must send setting name");
    name = name.toUpperCase();
    let settVal = this.settings[name];
    if (!settVal) throw new Error(`AppSetting '${name}' does not exist.`);
    return settVal;
  }
}

const insAppSettings = new AppSettings();
insAppSettings.Router = (options = {}) => {
  options.name = options.name || "settings";
  options.listeners = options.listeners || {
    update: () => {
      insAppSettings.refresh();
      console.log("settings updated...");
    },
  };
  return new Router(options);
};

module.exports = insAppSettings;
