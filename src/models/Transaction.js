import Joi from 'joi';
import TransactionSchema from '../schema/TransactionSchema';

class Transaction {
  constructor(
    from, to, value, fee, dateCreated, data,
    senderPubKey, transactionDataHash, senderSignature,
  ) {
    this.from = from;
    this.to = to;
    this.value = value;
    this.fee = fee;
    this.dateCreated = dateCreated;
    this.data = data;
    this.senderPubKey = senderPubKey;
    this.transactionDataHash = transactionDataHash;
    this.senderSignature = senderSignature;
  }

  isValid() {
    return !Joi.validate(this, TransactionSchema).error;
  }
}

export default Transaction;
