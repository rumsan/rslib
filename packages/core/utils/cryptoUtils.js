"use strict";

const ERR = {
  TOKEN_INVALID: new Error("Invalid Token"),
};

const crypto = require("crypto");
const { loadNodeModule } = require("./core");

const SALT_LENGTH = 64; // Length of the salt, in bytes
const HASH_LENGTH = 64; // Length of the hash, in bytes
const HASH_ITERATIONS = 1000; // Number of pbkdf2 iterations
const IV_LENGTH = 16; // For AES, this is always 16

const CryptoUtils = {
  generateJwtToken(data, secret, jwtDuration = "1h") {
    if (!secret)
      throw new Error("Must send 32 characters long app secret config.");
    const JWT = loadNodeModule("jsonwebtoken");
    var LZUTF8 = loadNodeModule("lzutf8");
    let tokenData = LZUTF8.compress(JSON.stringify(data), {
      outputEncoding: "StorageBinaryString",
    });

    return JWT.sign({ data: tokenData }, secret, {
      expiresIn: jwtDuration,
    });
  },

  validateJwtToken(token, secret, addTokenData = false) {
    if (!secret)
      throw new Error("Must send 32 characters long appSecret config.");
    const JWT = loadNodeModule("jsonwebtoken");
    var LZUTF8 = loadNodeModule("lzutf8");
    try {
      let tokenData = JWT.verify(token, secret);
      let data = LZUTF8.decompress(tokenData.data, {
        inputEncoding: "StorageBinaryString",
      });

      data = JSON.parse(data);
      if (addTokenData) data.tokenData = tokenData;

      return data;
    } catch (e) {
      console.log("validateJwtToken:", e.message);
      throw ERR.TOKEN_INVALID;
    }
  },

  generateRandom(length) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(length, (err, salt) => {
        if (err) reject(err);
        resolve(salt);
      });
    });
  },

  hash(data, salt) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        data,
        salt,
        HASH_ITERATIONS,
        HASH_LENGTH,
        "sha1",
        (err, hash) => {
          if (err) {
            reject(err);
          }
          resolve({
            salt: salt,
            hash: hash,
          });
        }
      );
    });
  },

  saltAndHash(data) {
    return CryptoUtils.generateRandom(SALT_LENGTH).then((salt) => {
      return CryptoUtils.hash(data, salt);
    });
  },

  encrypt(text, ENCRYPTION_KEY) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY),
      iv
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
  },

  decrypt(text, ENCRYPTION_KEY) {
    let textParts = text.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY),
      iv
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  },
};

module.exports = CryptoUtils;
