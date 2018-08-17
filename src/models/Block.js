import CryptoJS from 'crypto-js';

class Block {
  constructor(
    index, transactions, difficulty, prevBlockHash,
    minedBy, blockDataHash, nonce, dateCreated, blockHash,
  ) {
    this.index = index;
    this.transactions = transactions;
    this.difficulty = difficulty;
    this.prevBlockHash = prevBlockHash;
    this.minedBy = minedBy;
    this.blockDataHash = blockDataHash || this.calculateBlockDataHash();
    this.nonce = nonce;
    this.dateCreated = dateCreated;
    this.blockHash = blockHash;
  }

  calculateBlockDataHash() {
    const {
      index, difficulty, transactions, prevBlockHash,
    } = this;
    const dataString = JSON.stringify(transactions);
    return CryptoJS.SHA256(index + dataString + difficulty + prevBlockHash).toString();
  }

  calculateHash(blockDataHash, dateCreated, nonce) {
    const data = `${blockDataHash}|${dateCreated}|${nonce}`;
    return CryptoJS.SHA256(data).toString();
  }
}

export default Block;
