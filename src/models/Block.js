import CryptoJS from 'crypto-js';

class Block {
  constructor(
    index, prevBlockHash, dateCreated, transactions,
    difficulty, minedBy, nonce, blockHash,
  ) {
    this.index = index;
    this.prevBlockHash = prevBlockHash;
    this.dateCreated = dateCreated;
    this.transactions = transactions;
    this.difficulty = difficulty;
    this.minedBy = minedBy;
    this.nonce = nonce;
    this.blockHash = blockHash;
    this.blockDataHash = this.calculateHash();
  }

  calculateHash() {
    const {
      index, prevBlockHash, dateCreated, transactions, nonce,
    } = this;
    const dataString = JSON.stringify(transactions);
    return CryptoJS.SHA256(index + prevBlockHash + dateCreated + dataString + nonce).toString();
  }
}

export default Block;
