module.exports = {
  getUnixTimestamp(date) {
    if (date) return Math.floor(date.getTime() / 1000);
    else return Math.floor(new Date().getTime() / 1000);
  },
  now() {
    return Math.floor(Date.now() / 1000);
  },
};
