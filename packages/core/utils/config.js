const defaultConfigs = {
  isDebug: process.env.ENV_TYPE === "development",
  secret: null,
  jwtDuration: "12h",
  jwtDurationLong: "30d", //ToDo... expire
  otpValidateDuration: 600,
  enablePasswordAuthentication: false, //enable authentication using password
  autoUserApprove: false, //auto approves user after they are added
};

class Config {
  constructor() {
    Object.assign(this, defaultConfigs);
  }

  set(config = {}) {
    Object.assign(this, config);
  }

  get(name) {
    if (this[name] === undefined)
      throw new Error(`Config [${name}] is not defined.`);
    return this[name];
  }
}

module.exports = new Config();
