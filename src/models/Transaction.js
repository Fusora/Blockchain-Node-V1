import Joi from 'joi';
import { utils } from 'ethers';
import TransactionSchema from '../schema/TransactionSchema';

class Transaction {
  constructor(
    from, to, value, fee, dateCreated, data,
    senderPubKey, senderSignature,
  ) {
    this.from = from;
    this.to = to;
    this.value = value;
    this.fee = fee;
    this.dateCreated = dateCreated;
    this.data = data;
    this.senderPubKey = senderPubKey;
    this.senderSignature = senderSignature;
    this.transactionDataHash = this.transactionHash;
  }

  isValid() {
    return !Joi.validate(this, TransactionSchema).error;
  }

  get transactionHash() {
    const transactionToBeHash = {
      from: this.from,
      to: this.to,
      value: this.value,
      fee: this.fee,
      dateCreated: this.dateCreated,
      data: this.data,
      senderPubKey: this.senderPubKey,
    };

    const stringedTransaction = utils.toUtf8Bytes(JSON.stringify(transactionToBeHash));
    return utils.sha256(stringedTransaction);
  }
}

export default Transaction;
