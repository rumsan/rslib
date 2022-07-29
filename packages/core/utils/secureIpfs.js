module.exports = {
  isIpfsHash(hash) {
    if (hash.startsWith("Qm") && hash.length === 46) return true;
    return false;
  },
};
