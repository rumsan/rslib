const Joi = require("joi");
const AbstractValidator = require("@rumsan/utils/lib/abstract/validator");

module.exports = class extends AbstractValidator {
  validators = {
    add: {
      payload: Joi.object({
        name: Joi.string()
          .required()
          .example("Manager")
          .error(new Error("Invalid name.")),
        expiryDate: Joi.date().example(new Date()),
        permissions: Joi.alternatives()
          .try(Joi.array().items(Joi.string()), Joi.string())
          .required()
          .example(["user_read", "user_add"]),
      }),
    },
    get: {
      params: Joi.object({
        name: Joi.string(),
      }),
    },
    remove: {
      params: Joi.object({
        name: Joi.string(),
      }),
    },
    addPermissions: {
      params: Joi.object({
        name: Joi.string(),
      }),
      payload: Joi.alternatives()
        .try(Joi.array().items(Joi.string()), Joi.string())
        .required()
        .example(["user_read", "user_add"]),
    },
    removePermissions: {
      params: Joi.object({
        name: Joi.string(),
      }),
      payload: Joi.alternatives()
        .try(Joi.array().items(Joi.string()), Joi.string())
        .required()
        .example(["user_read", "user_add"]),
    },
  };
};
