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

  getAllKeys(obj, prefix = "") {
    return Object.keys(obj).reduce((res, el) => {
      if (Array.isArray(obj[el])) {
        return res;
      }
      if (typeof obj[el] === "object" && obj[el] !== null) {
        return [...res, ...getAllKeys(obj[el], `${prefix + el}.`)];
      }
      return [...res, prefix + el];
    }, []);
  },

  getAllValues(obj, prefix = "") {
    return Object.keys(obj).reduce((res, el) => {
      if (Array.isArray(obj[el])) {
        return res;
      }
      if (typeof obj[el] === "object" && obj[el] !== null) {
        return [...res, ...getAllValues(obj[el], obj[`${prefix + el}.`])];
      }
      return [...res, obj[prefix + el]];
    }, []);
  },
};
