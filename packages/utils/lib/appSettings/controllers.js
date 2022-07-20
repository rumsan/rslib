const AbstractController = require("../abstract/controller");
const SettingModel = require("./model");
const {
  ArrayUtils: { stringToArray },
  DataTypes: { isJsonObject },
  ObjectUtils: { convertObjectKeysToUpperCase },
} = require("../../index");

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
  };

  constructor(db) {
    super(db);
    this.table = SettingModel(db);
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
        isReadOnly:
          settings[name].isReadOnly === undefined
            ? true
            : settings[name].isReadOnly,
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
    name = name.toUpperCase();
    let setting = await this.table.findOne({
      where: { name, isPrivate: false },
    });
    if (!setting) return null;
    return setting.value.data;
  }

  async update(name, value) {
    name = name.toUpperCase();
    let setting = await this.table.findOne({
      where: { name, isPrivate: false },
    });
    if (!setting) throw new Error("Invalid setting name.");
    if (setting.isReadOnly) throw new Error("Setting is read-only.");
    value = { data: value };
    setting.value = value;
    return setting.save();
  }
}

module.exports = (db) => new Controller(db);
