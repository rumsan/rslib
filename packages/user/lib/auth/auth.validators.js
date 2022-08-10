const Joi = require("joi");
const AbstractValidator = require("@rumsan/core/abstract/validator");

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
    getOtpForService: {
      payload: Joi.object({
        service: Joi.string()
          .required()
          .example("email")
          .error(new Error("Invalid auth service.")),
        serviceId: Joi.string().required().example("test@rumsan.com"),
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
    getSignDataForWalletAuth: {
      query: Joi.object({
        cid: Joi.string().required(),
      }),
    },

    authenticateUsingWallet: {
      payload: Joi.object({
        signature: Joi.string().required(),
        signPayload: Joi.string().required(),
      }),
    },
  };
};
