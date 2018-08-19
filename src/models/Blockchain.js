import Block from './Block';
import Transaction from './Transaction';

const privateProperty = new WeakMap();
const coinbaseAddress = '0000000000000000000000000000000000000000';

class Blockchain {
  constructor(currentDifficulty = 4, transactions) {
    this.chain = [];
    this.difficulty = currentDifficulty;
    this.pendingTransactions = transactions || [];
    this.pendingBlock = undefined;
    this.generateGenesisBlock();
  }

  static isValidNewBlock(previousBlock, newBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
      return false;
    } if (previousBlock.blockHash !== newBlock.prevBlockHash) {
      return false;
    }
    return true;
  }

  static isValidBlockHash(blockHash, blockDataHash, dateCreated, nonce) {
    const hash = Block.calculateHash(blockDataHash, dateCreated, nonce);
    return hash.toString() === blockHash.toString();
  }

  static isValidHash(blockHash, networkDifficulty) {
    return blockHash.substring(0, networkDifficulty) === new Array(networkDifficulty + 1).join('0');
  }

  generateGenesisBlock() {
    const genesisBlock = new Block(0, undefined, 0, '0', coinbaseAddress, undefined, 0, '2018-08-17T08:33:54.119Z', '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7');
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

  getMiningJob() {
    if (!this.pendingBlock) {
      this.pendingBlock = new Block(
        this.getLatestBlock().index + 1,
        this.pendingTransactions,
        this.networkDifficulty,
        this.getLatestBlock().blockHash,
      );
    }

    return this.pendingBlock;
  }

  addBlock(blockedMineData, networkDifficulty) {
    const {
      blockHash, blockDataHash, nonce, dateCreated, minerAddress,
    } = blockedMineData;

    if (!this.pendingBlock) {
      return new Error('No block prepared for mining');
    }

    if (!Blockchain.isValidBlockHash(blockHash, blockDataHash, dateCreated, nonce)) {
      return new Error('The submitted block has an invalid hash');
    }

    if (!Blockchain.isValidNewBlock(this.getLatestBlock(), this.pendingBlock)) {
      return new Error('This is not a valid block');
    }

    if (!Blockchain.isValidHash(blockHash, networkDifficulty)) {
      return new Error('The submitted hash is invalid with the network difficulty');
    }

    // set miner data in pendingBlock after submitted mineData has been validated
    this.pendingBlock.nonce = nonce;
    this.pendingBlock.dateCreated = dateCreated;
    this.pendingBlock.blockHash = blockHash;
    this.pendingBlock.minedBy = minerAddress;

    const minerReward = {
      from: coinbaseAddress,
      to: minerAddress,
      value: 5000000,
      fee: this.pendingBlock.getTotalFees(),
      dateCreated: new Date().toISOString(),
      data: 'miner reward',
      senderPubKey: '00000000000000000000000000000000000000000000000000000000000000000',
      senderSignature: ['00000000000000000000000000000000000000000000000000000000000000000', '00000000000000000000000000000000000000000000000000000000000000000'],
    };

    // add the block to the chain
    // remove pending transactions that were inside the newly mined block
    // add the coinbase reward as the first transaction for the next block

    this.chain.push(this.pendingBlock);
    this.removeTransactions(this.pendingBlock.transactions);
    this.pendingTransactions.unshift(minerReward);
    this.pendingBlock = undefined;

    return this.getLatestBlock();
  }

  addTransaction(transaction) {
    const {
      from, to, value, fee, dateCreated, data,
      senderPubKey, senderSignature,
    } = transaction;
    const newTransaction = new Transaction(
      from, to, value, fee, dateCreated,
      data, senderPubKey, senderSignature,
    );
    const index = this.pendingTransactions.push(newTransaction);
    return this.pendingTransactions[index - 1];
  }

  removeTransactions(transactions) {
    const transactionHashes = transactions.map(t => t.transactionDataHash);
    this.pendingTransactions = this.pendingTransactions.filter((t) => {
      if (!transactionHashes.includes(t.transactionDataHash)) {
        return t;
      }
      return null;
    });
    return this.pendingTransactions;
  }

  replaceChain(newBlocks) {
    if (Blockchain.isValidChain(newBlocks) && newBlocks.length > this.chain.length) {
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
      if (Blockchain.isValidNewBlock(tempBlock[i - 1], chain[i])) {
        tempBlock.push(chain[i]);
      } else {
        return false;
      }
    }
    return true;
  }
}

export default Blockchain;
