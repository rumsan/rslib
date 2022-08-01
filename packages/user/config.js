const defaultConfigs = {
  isDevEnvironment: false,
  appSecret: null,
  jwtDuration: 1200000,
  otpValidateDuration: 600,
  enablePasswordAuthentication: false, //enable authentication using password
  autoUserApprove: false, //auto approves user after they are added
};

class UserConfig {
  constructor() {
    Object.assign(this, defaultConfigs);
  }
  setConfig(config = {}) {
    if (!config.appSecret) throw new Error("Must send appSecret.");
    Object.assign(this, config);
  }
}

module.exports = new UserConfig();
