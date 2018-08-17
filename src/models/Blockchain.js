import Block from './Block';
import Model from './Model';
import Transaction from './Transaction';

const privateProperty = new WeakMap();

class Blockchain extends Model{
  constructor(currentDifficulty, transactions) {
    this.chain = [];
    this.difficulty = currentDifficulty;
    this.pendingTransactions = transactions || [];
    this.generateGenesisBlock();
  }

  static get schema() {
    
  }

  generateGenesisBlock() {
    const genesisBlock = new Block(0, '0', 1465154705, undefined, 0, '0000000000000000000000000000000000000000', 0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7');
    if (!this.chain.includes(genesisBlock)) {
      privateProperty.set(this, { genesisBlock });
      this.chain.push(genesisBlock);
    }
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  getConfirmedTransactions() {
    return this.chain.reduce((acc, val) => {
      if (val.transactions) {
        acc.push(...val.transactions);
      }
      return acc;
    }, []);
  }

  getTransaction(transactionHash) {
    const confirmedTransactions = this.getConfirmedTransactions();
    return confirmedTransactions.filter(t => t.transactionDataHash === transactionHash)[0];
  }

  addBlock(newBlock) {
    if (this.isValidNewBlock(this.getLatestBlock(), newBlock)) {
      this.chain.push(newBlock);
    }
  }

  addTransaction(transaction) {
    const {
      sender, recipient, value, fee, dateCreated, data,
      senderPubKey, transactionDataHash, senderSignature,
    } = transaction;
    const newTransaction = new Transaction(
      sender, recipient, value, fee, dateCreated,
      data, senderPubKey, transactionDataHash, senderSignature,
    );
    const index = this.pendingTransactions.push(newTransaction);
    return this.pendingTransactions[index - 1];
  }

  replaceChain(newBlocks) {
    if (this.isValidChain(newBlocks) && newBlocks.length > this.chain.length) {
      this.chain = newBlocks;
    } else {
      console.log('Invalid chain replacement');
    }
  }

  isValidChain(chain) {
    if (chain[0] !== privateProperty.get(this).genesisBlock) {
      return false;
    }
    const tempBlock = [chain[0]];
    for (let i = 1; i < chain.length; i += 1) {
      if (this.isValidNewBlock(tempBlock[i - 1], chain[i])) {
        tempBlock.push(chain[i]);
      } else {
        return false;
      }
    }
    return true;
  }

  isValidNewBlock(previousBlock, newBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
      return false;
    } if (previousBlock.hash !== newBlock.previousHash) {
      return false;
    }
    return true;
  }
}

export default Blockchain;
