import CryptoJS from 'crypto-js';
import Trie from './Trie';

class Block {
  constructor(props) {
    const {
      index, transactions, difficulty, prevBlockHash,
      minedBy, nonce, dateCreated, blockHash, trie,
    } = props;
    this.index = index;
    this.transactions = transactions || [];
    this.difficulty = difficulty;
    this.prevBlockHash = prevBlockHash;
    this.blockDataHash = Block.calculateBlockDataHash(
      this.index, this.difficulty,
      this.transactions, this.prevBlockHash,
    );

    // properties to be modified after a block is mined

    this.minedBy = minedBy;
    this.nonce = nonce;
    this.dateCreated = dateCreated;
    this.blockHash = blockHash;
    this.stateTrie = trie || new Trie();
  }

  static calculateHash(blockDataHash, dateCreated, nonce) {
    const data = `${blockDataHash}|${dateCreated}|${nonce}`;
    return CryptoJS.SHA256(data).toString();
  }

  static calculateBlockDataHash(index, difficulty, transactions, prevBlockHash) {
    const dataString = JSON.stringify(transactions);
    return CryptoJS.SHA256(index + dataString + difficulty + prevBlockHash).toString();
  }

  getTotalFees() {
    return this.transactions.reduce((total, val) => {
      let totalFees = total;
      totalFees += Number(val.fee);
      return totalFees;
    }, 0);
  }
}

export default Block;
