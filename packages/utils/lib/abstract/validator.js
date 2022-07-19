module.exports = class AbstractValidator {
  constructor(config) {
    if (this.constructor == AbstractValidator) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    if (!config)
      throw new Error("AbstractValidator: Must send config parameter");
    this.config = config;
  }

  validators = {};

  add(validators) {
    this.validators = { ...this.validators, ...validators };
  }

  get() {
    return this.validators;
  }
};
