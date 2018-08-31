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
    this.blockDataHash = blockDataHash || this.calculateBlockDataHash();
    // properties to be modified after a block is mined
    this.minedBy = minedBy;
    this.nonce = nonce;
    this.dateCreated = dateCreated;
    this.blockHash = blockHash;
  }

  static calculateHash(blockDataHash, dateCreated, nonce) {
    const data = `${blockDataHash}|${dateCreated}|${nonce}`;
    return CryptoJS.SHA256(data).toString();
  }

  calculateBlockDataHash() {
    const {
      index, difficulty, transactions, prevBlockHash,
    } = this;
    const dataString = JSON.stringify(transactions);
    return CryptoJS.SHA256(index + dataString + difficulty + prevBlockHash).toString();
  }

  getTotalFees() {
    if (this.transactions) {
      return this.transactions.reduce((total, val) => {
        let totalFees = total;
        totalFees += Number(val.fee);
        return totalFees;
      }, 0);
    }
    return 0;
  }

  addTransaction(transaction) {
    if (!this.transactions) this.transactions = [];
    this.transactions.push(transaction);
    return this.transactions;
  }
}

export default Block;
