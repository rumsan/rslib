const loadModule = (moduleName) => {
  try {
    return require(moduleName);
  } catch (e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
      throw new Error(`rs-user: Please install ${moduleName} package manually`);
    }

    throw e;
  }
};

module.exports = { loadModule };
