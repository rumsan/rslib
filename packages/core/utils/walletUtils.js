const { loadNodeModule } = require("./core");
const { randomNumber } = require("./mathUtils");
const { encrypt, decrypt } = require("./cryptoUtils");
const { getUnixTimestamp } = require("./dateUtils");

const loadEthers = () => {
  return loadNodeModule("ethers");
};

module.exports = {
  generateDataToSign(
    data,
    secret,
    { validDurationInSeconds = 600, useRandom = false }
  ) {
    if (!secret)
      throw new Error(
        "WalletUtils: Must send secret in to generate toSign payload"
      );

    data = Object.assign(
      {
        random: randomNumber(6),
        expireOn: getUnixTimestamp() + validDurationInSeconds,
      },
      data
    );
    return encrypt(JSON.stringify(data), secret);
  },

  getAddressFromSignature(signature, signPayload, secret) {
    const ethers = loadEthers();
    if (!signPayload) throw Error("Must send 'auth-signature'");
    try {
      const data = JSON.parse(decrypt(signPayload, secret));
      if (getUnixTimestamp() > data.expireOn)
        throw Error("Signature has expired.");
      const address = ethers.utils.recoverAddress(
        ethers.utils.hashMessage(signatureWithData),
        signature
      );
      return ethers.utils.getAddress(address);
    } catch (e) {
      throw new Error("Signature failed or expired. Try again.");
    }
  },
};
