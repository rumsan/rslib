module.exports = {
  convertToInteger(value, err) {
    value = parseInt(value);
    if (isNaN(value)) throw new Error(err || "Must be an integer.");
    return value;
  },

  isUUID(uuid, err) {
    let s = "" + uuid;

    s = s.match(
      "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    );
    if (s === null) {
      if (err) throw new Error(err);
      return false;
    }
    return true;
  },

  isJsonObject(str, isAlreadyString = false) {
    try {
      if (Array.isArray(str)) return false;
      var json = isAlreadyString
        ? JSON.parse(str)
        : JSON.parse(JSON.stringify(str));
      return typeof json === "object";
    } catch (e) {
      return false;
    }
  },
};
