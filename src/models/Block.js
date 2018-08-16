import CryptoJS from 'crypto-js';

class Block {
  constructor(index, previousHash, dateCreated, transactions, difficulty, minedBy, nonce, hash) {
    this.index = index;
    this.previousHash = previousHash;
    this.dateCreated = dateCreated;
    this.transactions = transactions;
    this.difficulty = difficulty;
    this.minedBy = minedBy;
    this.nonce = nonce;
    this.hash = hash;
  }

  calculateHash() {
    const {
      index, previousHash, dateCreated, transactions, nonce,
    } = this;
    const dataString = JSON.stringify(transactions);
    return CryptoJS.SHA256(index + previousHash + dateCreated + dataString + nonce).toString();
  }
}

export default Block;
