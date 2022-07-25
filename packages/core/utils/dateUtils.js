module.exports = {
  getUnixTimestamp(date) {
    if (date) return parseInt((date.getTime() / 1000).toFixed(0));
    else return parseInt((new Date().getTime() / 1000).toFixed(0));
  },
};
