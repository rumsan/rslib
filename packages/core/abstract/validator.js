module.exports = class AbstractValidator {
  constructor(config) {
    if (this.constructor == AbstractValidator) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.config = config;
  }

  validators = {};

  addValidator(validators) {
    this.validators = { ...this.validators, ...validators };
  }

  getValidators() {
    return this.validators;
  }
};
