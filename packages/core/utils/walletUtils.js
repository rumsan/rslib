const { loadNodeModule } = require("./core");
const { encrypt, decrypt } = require("./cryptoUtils");
const { getUnixTimestamp } = require("./dateUtils");

const loadEthers = () => {
  return loadNodeModule("ethers");
};

module.exports = {
  generateDataToSign(clientId, { secret, ip, validDurationInSeconds = 600 }) {
    if (!secret)
      throw new Error(
        "WalletUtils: Must send secret in to generate toSign payload"
      );

    let data = {
      clientId,
      expireOn: getUnixTimestamp() + validDurationInSeconds,
      ip,
    };
    return encrypt(JSON.stringify(data), secret);
  },

  validateSignature(signature, signPayload, { secret, ip }) {
    if (!secret)
      throw new Error(
        "WalletUtils: Must send secret in to generate toSign payload"
      );
    if (!signature) throw Error("Must send 'signature'");
    if (!signPayload) throw Error("Must send 'signPayload'");

    const ethers = loadEthers();
    try {
      const data = JSON.parse(decrypt(signPayload, secret));
      if (data.ip && ip !== data.ip)
        throw new Error(
          `signature sent from different IP address. [signatureIP:${data.ip}, clientIP:${ip}]`
        );
      if (getUnixTimestamp() > data.expireOn)
        throw Error("Signature has expired.");
      const address = ethers.utils.recoverAddress(
        ethers.utils.hashMessage(signPayload),
        signature
      );
      data.address = ethers.utils.getAddress(address);
      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
