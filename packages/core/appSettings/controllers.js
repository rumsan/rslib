const AbstractController = require("../abstract/controller");
const SettingModel = require("./model");

const {
  ArrayUtils: { stringToArray },
  TypeUtils: { isJsonObject },
  ObjectUtils: { convertObjectKeysToUpperCase },
} = require("../utils");

const hasAllFields = (requiredFields, suppliedFields) => {
  requiredFields = stringToArray(requiredFields);
  suppliedFields = stringToArray(suppliedFields);

  return requiredFields.every((element) => {
    return suppliedFields.indexOf(element) !== -1;
  });
};

class Controller extends AbstractController {
  registrations = {
    update: (req) => this.update(req.params.name, req.payload),
    getPublic: (req) => this.getPublic(req.params.name),
    listPublic: () => this.listPublic(),
  };

  constructor(db, eventMgr) {
    super(db);
    this.table = SettingModel(db);
    this.eventMgr = eventMgr;
    delete this.db;
    delete this.config;
  }

  //IMPORTANT: function beginning with _. Call internally only
  _add(payload) {
    payload.name = payload.name.toUpperCase();

    payload.requiredFields = payload.requiredFields
      ? stringToArray(payload.requiredFields)
      : null;

    if (payload.requiredFields) {
      if (!isJsonObject(payload.value))
        throw new Error(
          "Must send JSON object when requiredField is specified."
        );

      payload.requiredFields = payload.requiredFields.map((f) => {
        return f.toUpperCase();
      });
      payload.value = convertObjectKeysToUpperCase(payload.value);

      const suppliedFields = Object.keys(payload.value);
      if (!hasAllFields(payload.requiredFields, suppliedFields))
        throw new Error(
          `Must send all required fields [${payload.requiredFields.join(",")}]`
        );
    }

    payload.value = { data: payload.value };
    return this.table.create(payload);
  }

  async _addBulk(settings) {
    let names = Object.keys(settings);
    for (let name of names) {
      let value = settings[name].value;
      let payload = {
        name,
        isReadOnly: settings[name].isReadOnly,
        isPrivate:
          settings[name].isPrivate === undefined
            ? true
            : settings[name].isPrivate,
      };
      if (isJsonObject(value)) payload.requiredFields = Object.keys(value);
      payload.value = value;
      await this._add(payload);
    }
  }

  _listRecords() {
    return this.table.findAll();
  }

  async _list() {
    let list = await this._listRecords();
    let objList = {};
    list.forEach((v) => {
      objList[v.name] = v.value.data;
    });
    return objList;
  }

  async _get(name) {
    name = name.toUpperCase();
    return this.table.findOne({
      where: { name },
    });
  }

  async _getValue(name) {
    let setting = await this._get(name);
    if (setting) return setting.value.data;
    else return null;
  }

  //public functions
  async getPublic(name) {
    if (!name) throw new Error("Must send setting name");
    name = name.toUpperCase();
    let setting = await this.table.findOne({
      where: { name, isPrivate: false },
    });
    if (!setting) throw new Error("Setting name does not exists");
    return setting.value.data;
  }

  async listPublic() {
    let list = await this.table.findAll({
      where: { isPrivate: false },
    });
    let objList = {};
    list.forEach((v) => {
      objList[v.name] = v.value.data;
    });
    return objList;
  }

  async update(name, value) {
    if (!name) throw new Error("Must send setting name");
    name = name.toUpperCase();
    let setting = await this.table.findOne({
      where: { name, isPrivate: false },
    });
    if (!setting) throw new Error("Invalid setting name.");
    if (setting.isReadOnly) throw new Error("Setting is read-only.");

    if (setting.requiredFields) {
      value = convertObjectKeysToUpperCase(value);
      const suppliedFields = Object.keys(value);
      if (!hasAllFields(setting.requiredFields, suppliedFields))
        throw new Error(
          `Must send all required fields [${setting.requiredFields.join(",")}]`
        );
    }

    setting.value = { data: value };
    let retSett = await setting.save();
    if (this.eventMgr) this.eventMgr.emit("update");
    return retSett;
  }
}

module.exports = (db, eventMgr) => {
  return new Controller(db, eventMgr);
};
