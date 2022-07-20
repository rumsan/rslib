module.exports = {
  loadNodeModule(moduleName, version) {
    try {
      return require(moduleName);
    } catch (e) {
      if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
        version = version ? `version: ${version}]` : "version: latest";
        let yarnVersion = version ? `@${version}` : "";
        throw new Error(
          `Module [${moduleName}](${version}) not found. Please install it manually. Run this command.
          yarn add ${moduleName}${yarnVersion}
          `
        );
      }

      throw e;
    }
  },
};
