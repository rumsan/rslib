module.exports = {
  stringToArray(value) {
    value = value || [];
    if (typeof value == "string") value = value.split(",");
    return value.map((v) => v.trim());
  },
};
