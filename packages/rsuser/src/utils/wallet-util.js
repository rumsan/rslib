const ethers = require("ethers");
const web3_accounts = require("web3-eth-accounts");
const Web3Utils = require("web3-utils");

class WalletUtils {
  constructor({ config }) {
    this.config = config;
  }

  getChecksumAddress = (address) => Web3Utils.toChecksumAddress(address);

  getAddressFromSignature = async (signatureWithData) => {
    account = new web3_accounts();
    if (!signatureWithData) throw Error("Must send 'auth-signature'");
    [data, message, signature] = signatureWithData.split(".");
    dateDiff = (Date.now() - parseInt(data, 10)) / 1000;
    if (dateDiff > this.config.appSignatureValidity)
      throw Error("Signature has expired.");
    address = await account.recover(message, signature);
    return this.getChecksumAddress(address);
  };

  getSignature = async () => {
    signer = new ethers.Wallet(this.config.w3PrivateKey);
    date = Date.now();
    sign = await signer.signMessage(date);
    return `${date}.${sign}`;
  };
}

module.exports = WalletUtils;
