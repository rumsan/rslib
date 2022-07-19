const ERR = {
  DEFAULT: ["Error Occured", "none", 500],
  APP_SECRET: ["AppSecret is undefined.", "app_secret", 500],
  APP_SECRET32: ["AppSecret must be 32 characters long.", "app_secret32", 500],
  AUTH_EXISTS: ["User auth already exists.", "auth_exists", 400],
  AUTH_NOEXISTS: ["User auth does not exist.", "auth_noexists", 401],
  AUTH_REQ: [
    'Must send auth data. eg: {type:"email","username":"santosh@rumsan.com"}',
    "auth_req",
    400,
  ],
  DB_UNDEFINED: ["db is undefined.", "db_undefined", 500],
  EMAIL_REQ: ["Email is required.", "email_req", 400],
  NAME_REQ: ["Name is required.", "name_req", 400],
  NOT_IMPLEMENTED: [
    "This function is not implemented yet. Please over-write it yourself",
    "not_implemented",
    400,
  ],
  LOGIN_INVALID: ["Invalid username or password", "login_invalid", 401],
  LOGIN_REQ: ["Username and password are required.", "password_req", 400],
  PASSWORD_FORMAT: [
    "password must contain salt and hash.",
    "password_format",
    400,
  ],
  MODEL_REQ: ["Must send valid sequelize model", "model_req", 500],
  PASSWORD_REQ: ["Password is required.", "password_req", 400],
  PWD_NOTMATCH: ["Password does not match.", "pwd_nomatch", 400],
  PHONE_REQ: ["Phone is required", "phone_req", 400],
  ROLE_NAME_REQ: ["Role name is required", "role_name_req", 400],
  ROLE_NOEXISTS: ["Role does not exist", "role_noexists", 400],
  ROLE_ISSYSTEM: ["Cannot modify system roles", "role_issystem", 400],
  TOKEN_INVALID: [
    "Token is invalid or expired. Please get a new one.",
    "token_invalid",
    401,
  ],
  USER_NOEXISTS: ["User does not exists", "user_noexists", 400],
  USERID_REQ: ["user_id is required", "userid_req", 400],
  USERNAME_EXISTS: ["Username already exists.", "username_exists", 400],
  USERNAME_REQ: ["Username is required.", "username_req", 400],
  WALLET_REGISTER_FAILED: [
    "Wallet registration failed",
    "wallet_register_failed",
    400,
  ],
};

const { RSError } = require("@rumsan/utils");
module.exports = {
  ERR,
  throwError(err) {
    if (!err)
      throw new Error(
        "RSError has not been defined. Please define it in Error constants file."
      );
    if (typeof err == "string")
      throw new RSError(err, "unknown", 500, "rs-user");
    const [msg, name, httpCode] = err;
    throw new RSError(msg, name, httpCode, "rs-user");
  },
  checkCondition(condition, err) {
    if (!condition) {
      if (!err) throw new RSError("checkCondition failed", "check-failed");
      if (typeof err == "string")
        throw new RSError(err, "unknown", 500, "rs-user");
      const [msg, name, httpCode] = err;
      throw new RSError(msg, name, httpCode, "rs-user");
    }
  },
};
