const { loadNodeModule } = require("../utils/core");
module.exports = () => {
  const Joi = loadNodeModule("joi");
  return {
    update: {
      params: Joi.object({
        name: Joi.string(),
      }),
      payload: Joi.any()
        .required()
        .example("TestValue")
        .error(new Error("Invalid value.")),
    },
    getPublic: {
      params: Joi.object({
        name: Joi.string(),
      }),
    },
  };
};
