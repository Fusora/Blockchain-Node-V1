import Joi from 'joi';
import { utils } from 'ethers';
import transactionSchema from '../schema/TransactionSchema';
import Model from './Model';

class Transaction extends Model {
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
  }

  static get schema() {
    return transactionSchema;
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
