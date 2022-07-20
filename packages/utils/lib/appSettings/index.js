const Controller = require("./controllers");
const Router = require("./routes");

module.exports = (db) => {
  const controller = Controller(db);
  return {
    controller,
    router: new Router(db, "appsettings"),
    getSettings: async () => {
      return await controller._list();
    },
  };
};
