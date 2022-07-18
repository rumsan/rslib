module.exports = {
  loadNodeModule(moduleName) {
    try {
      return require(moduleName);
    } catch (e) {
      if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
        throw new Error(
          `Module [${moduleName}] not found. Please install it manually`
        );
      }

      throw e;
    }
  },
};
