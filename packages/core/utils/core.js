module.exports = {
  loadNodeModule(moduleName, version) {
    try {
      return require(moduleName);
    } catch (e) {
      if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
        version = version ? `version: ${version}]` : "version: latest";
        //let yarnVersion = version ? `@${version}` : "";
        throw new Error(
          `NPM Module [${moduleName}] not found. Please install (${version}) manually. Run this command.
          yarn add ${moduleName}
          `
        );
      }

      throw e;
    }
  },

  rscheck(trueCondition, errorMessage) {
    if (!trueCondition) {
      throw new Error(errorMessage);
    }
  },
};
