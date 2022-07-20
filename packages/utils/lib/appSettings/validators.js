const Joi = require("joi");

module.exports = {
  update: {
    params: Joi.object({
      name: Joi.string(),
    }),
    payload: Joi.object({
      value: Joi.any()
        .required()
        .example("TestValue")
        .error(new Error("Invalid value.")),
    }),
  },
  getPublic: {
    params: Joi.object({
      name: Joi.string(),
    }),
  },
};
