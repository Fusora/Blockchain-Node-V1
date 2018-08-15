import CryptoJS from 'crypto-js';

class Block {
  constructor(index, previousHash, timestamp, transactions, difficulty, minedBy, nonce, hash) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.difficulty = difficulty;
    this.minedBy = minedBy;
    this.nonce = nonce;
    this.hash = hash;
  }

  calculateHash() {
    const {
      index, previousHash, timestamp, transactions, nonce,
    } = this;
    const dataString = JSON.stringify(transactions);
    return CryptoJS.SHA256(index + previousHash + timestamp + dataString + nonce).toString();
  }
}

export default Block;
