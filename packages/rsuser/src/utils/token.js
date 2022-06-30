const Secure = require("./secure");
const { ERR } = require("./error");
const Common = require("./common");
let JWT;

class Token {
  constructor({ appSecret, jwtDuration = 3600000 }) {
    JWT = Common.loadModule("jsonwebtoken");
    if (!appSecret) throw ERR.APP_SECRET;
    if (appSecret.length != 32) throw ERR.APP_SECRET32;
    this.secret = appSecret;
    this.jwtDuration = jwtDuration;
  }

  generate(data) {
    return JWT.sign(
      {
        data: Secure.encrypt(JSON.stringify(data), this.secret),
      },
      this.secret,
      {
        expiresIn: this.jwtDuration,
      }
    );
  }

  validate(token) {
    var me = this;
    return new Promise((resolve, reject) => {
      JWT.verify(token, me.secret, (err, tokenData) => {
        if (err) throw ERR.TOKEN_INVALID;
        let data = tokenData.data || false;
        if (data) {
          data = JSON.parse(Secure.decrypt(data, me.secret));
        }
        resolve({ data, tokenData });
      });
    });
  }
}

module.exports = Token;
