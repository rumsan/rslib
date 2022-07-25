const UserSignupMixin = require("./signup.mixins");
const UserAuthMixin = require("./auth.mixins");
const UserRoleMixin = require("./role.mixins");

module.exports = {
  UserAuthMixin,
  UserRoleMixin,
  UserSignupMixin,
  getUserMixins() {
    return Object.assign(UserAuthMixin, UserRoleMixin, UserSignupMixin);
  },
};
