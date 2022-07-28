module.exports = {
  convertToJson(data) {
    data = JSON.stringify(data);
    return JSON.parse(data);
  },
};
