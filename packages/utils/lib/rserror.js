module.exports = class RSError extends Error {
  constructor(message, name = "unknown", httpCode = 500, group = "rs-misc") {
    super();
    this.message = message;
    this.data = {
      group,
      type: "rserror",
      message,
      name,
      httpCode,
    };
    this.status = httpCode;
    this.stack = new Error(message).stack;
  }
};
