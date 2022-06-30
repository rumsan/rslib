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

function isUUID(uuid) {
  let s = "" + uuid;

  s = s.match(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
  );
  if (s === null) {
    return false;
  }
  return true;
}

module.exports = { loadModule, isUUID };
