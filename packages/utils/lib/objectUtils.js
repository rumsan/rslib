module.exports = {
  convertObjectKeysToUpperCase(source) {
    return Object.keys(source).reduce((destination, key) => {
      destination[key.toUpperCase()] = source[key];
      return destination;
    }, {});
  },

  convertObjectKeysToLowerCase(source) {
    return Object.keys(source).reduce((destination, key) => {
      destination[key.toLowerCase()] = source[key];
      return destination;
    }, {});
  },
};
