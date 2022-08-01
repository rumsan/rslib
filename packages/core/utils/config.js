const defaultConfigs = {
  isDevEnvironment: process.env.ENV_TYPE === "development",
  appSecret: null,
  jwtDuration: 1200000,
  otpValidateDuration: 600,
  enablePasswordAuthentication: false, //enable authentication using password
  autoUserApprove: false, //auto approves user after they are added
};

class Config {
  constructor() {
    Object.assign(this, defaultConfigs);
  }

  set(config = {}) {
    //if (!config.appSecret) throw new Error("Must send appSecret.");
    Object.assign(this, config);
  }

  get(name) {
    if (this[name] === undefined)
      throw new Error(`Config [${name}] is not defined.`);
    return this[name];
  }
}

module.exports = new Config();
