const Joi = require("joi");

module.exports = {
  authenticate: {
    params: Joi.object({
      service: Joi.string().required(),
      data: Joi.any().required(),
    }),
  },
  manageUsingAction: {
    params: Joi.object({
      userId: Joi.string(),
    }),
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
      payload: Joi.object({
        service: Joi.string()
          .required()
          .example("email")
          .error(new Error("Invalid auth service.")),
      }),
    }),
  },
};
