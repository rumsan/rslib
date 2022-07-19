const Joi = require("joi");
const AbstractValidator = require("@rumsan/utils/lib/abstract/validator");

module.exports = class extends AbstractValidator {
  validators = {
    authenticate: {
      payload: Joi.object({
        service: Joi.string().required(),
        data: Joi.any().required(),
      }),
    },
    manageUsingAction: {
      payload: Joi.object({
        action: Joi.string()
          .required()
          .example("change-password")
          .error(new Error("Invalid auth service.")),
        data: Joi.any().required(),
      }),
    },
    listUserAuthServices: {
      params: Joi.object({
        userId: Joi.number().required(),
      }),
    },
    removeUserAuthService: {
      params: Joi.object({
        userId: Joi.number().required(),
      }),
      payload: Joi.object({
        service: Joi.string()
          .required()
          .example("email")
          .error(new Error("Invalid auth service.")),
      }),
    },
  };
};
