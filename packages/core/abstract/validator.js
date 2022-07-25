module.exports = class AbstractValidator {
  constructor(options) {
    if (this.constructor == AbstractValidator) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    Object.assign(this, options);
  }

  validators = {};

  addValidator(validators) {
    this.validators = { ...this.validators, ...validators };
  }

  getValidators() {
    return this.validators;
  }
};
