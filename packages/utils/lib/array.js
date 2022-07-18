module.exports = {
  stringToArray(value) {
    if (typeof value == "string") return value.split(",");
    else return value || [];
  },
};
