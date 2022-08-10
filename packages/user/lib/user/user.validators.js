const Joi = require("joi");
const AbstractValidator = require("@rumsan/core/abstract/validator");

module.exports = class extends AbstractValidator {
  validators = {
    signupUsingEmail: {
      payload: Joi.object({
        name: Joi.string()
          .required()
          .example("Mr. Ram Singh")
          .error(new Error("Invalid name.")),
        email: Joi.string()
          .required()
          .email()
          .example("test@test.com")
          .error(new Error("Invalid email.")),
        password: Joi.string()
          .optional()
          .example("$xample")
          .error(new Error("Invalid password.")),
      }),
    },
    signupUsingWallet: {
      payload: Joi.object({
        name: Joi.string()
          .required()
          .example("Mr. Ram Singh")
          .error(new Error("Invalid name.")),
        wallet: Joi.string()
          .required()
          .example("0x950aF1Af61dDC38B8Eb8A3fb720641F377bBb909")
          .error(new Error("Invalid wallet address.")),
      }),
    },
    getById: {
      params: Joi.object({
        id: Joi.string(),
      }),
    },
    login: {
      payload: Joi.object({
        email: Joi.string()
          .required()
          .email()
          .example("test@test.com")
          .error(new Error("Invalid email.")),
        password: Joi.string().required(),
      }),
    },
    loginUsingOtp: {
      payload: Joi.object({
        service: Joi.string().required().example("email"),
        serviceId: Joi.string().required().example("test@rumsan.com"),
        otp: Joi.string().required(),
      }),
    },
    loginUsingWallet: {
      payload: Joi.object({
        signature: Joi.string().required(),
        signPayload: Joi.string().required(),
      }),
    },
    remove: {
      params: Joi.object({
        id: Joi.number(),
      }),
    },
    update: {
      params: Joi.object({
        id: Joi.number(),
      }),
      payload: Joi.object({
        name: Joi.string().required().example("Mr. Ram Singh"),
        gender: Joi.string().optional().example("U"),
      }),
    },
    updateEmail: {
      params: Joi.object({
        id: Joi.number(),
      }),
      payload: Joi.object({
        email: Joi.string()
          .required()
          .email()
          .example("test@test.com")
          .error(new Error("Invalid email address.")),
      }),
    },
    updatePhone: {
      params: Joi.object({
        id: Joi.number(),
      }),
      payload: Joi.object({
        phone: Joi.string()
          .required()
          .example("9876543210")
          .error(new Error("Invalid email address.")),
      }),
    },
    addPermissions: {
      params: Joi.object({
        name: Joi.number(),
      }),
      payload: Joi.alternatives()
        .try(Joi.array().items(Joi.string()), Joi.string())
        .required()
        .example(["test_role", "manager"]),
    },
  };
};
