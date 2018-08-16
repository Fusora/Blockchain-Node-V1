const utils = require('ethers').utils;

class Transaction {
  constructor(sender, recipient, value, fee, dateCreated, data, senderPubKey, senderSignature) {
    this.sender = sender;
    this.recipient = recipient;
    this.value = value;
    this.fee = fee;
    this.dateCreated = dateCreated;
    this.data = data;
    this.senderPubKey = senderPubKey;
    // this.transactionDataHash = transactionDataHash;
    this.senderSignature = senderSignature;
  }

  isValidTransaction() {
    if (!(this.isValidHex(this.sender, 40)
            && this.isValidHex(this.recipient, 40)
            && this.isValidHex(this.senderPubKey, 65))) {
      return false;
    } if (!(this.isPositiveNumber(this.value)
            && this.isPositiveNumber(this.fee))) {
      return false;
    } if (this.senderSignature.length !== 2) {
      return false;
    }
    return true;
  }

  isValidHex(hex, hexLength) {
    if (hex.length != hexLength) {
      return false;
    }
    return true;
  }

  isPositiveNumber(number) {
    return parseFloat(number) >= 0;
  }

  get transactionHash() {
    const transactionToBeHash = {
      'sender': this.sender,
      'recipient': this.recipient,
      'value': this.value,
      'fee': this.fee,
      'dateCreated': this.dateCreated,
      'data': this.data,
      'senderPubKey': this.senderPubKey,
    };

    const stringedTransaction = utils.toUtf8Bytes(JSON.stringify(transactionToBeHash));
    return utils.sha256(stringedTransaction);
  }
}

export default Transaction;

