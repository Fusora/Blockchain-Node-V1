import Block from './Block';
import Transaction from './Transaction';
import Trie from './Trie';

const coinbaseAddress = '0000000000000000000000000000000000000000';

class Blockchain {
  constructor(currentDifficulty = 4) {
    this.chain = [];
    this.difficulty = currentDifficulty;
    this.pendingTransactions = [];
    this.miningJobs = {};
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
    const genesisBlock = new Block({
      index: 0,
      difficulty: 0,
      prevBlockHash: '0',
      minedBy: coinbaseAddress,
      nonce: 0,
      dateCreated: '2018-08-17T08:33:54.119Z',
      blockHash: '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7',
    });
    if (!this.chain.includes(genesisBlock)) {
      this.chain.push(genesisBlock);
    }
  }

  getBalance(address, options = { confirmations: 0 }) {
    const { confirmations } = options;
    const block = this.chain[this.chain.length - Number(confirmations) - 1];
    return (block && block.stateTrie.getValue(address)) || 0;
  }

  getBalances(options = { confirmations: 0 }) {
    const { confirmations } = options;
    const block = this.chain[this.chain.length - Number(confirmations) - 1];
    return (block && block.stateTrie.getAllValues()) || {};
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

  getTransactionsByAddress(address) {
    const confirmedTransactions = this.getConfirmedTransactions();
    return confirmedTransactions.filter(t => t.from === address || t.to === address);
  }

  takeMiningJob(minerAddress) {
    // Remove invalid transactions from the pendingTransactions using the latestStateTrie
    // Add block as miningJob mapped with minerAddress as key
    // Allow transaction if it came from coinbase address

    const latestStateTrie = this.getLatestBlock().stateTrie;
    const invalidTransactions = this.pendingTransactions.filter((txn) => {
      const { from, value, fee } = txn;
      const senderValue = latestStateTrie.getValue(from);
      return senderValue < value + fee && from !== coinbaseAddress;
    });

    this.removeFromPendingTransactions(invalidTransactions);

    const block = new Block({
      index: this.getLatestBlock().index + 1,
      transactions: this.pendingTransactions,
      difficulty: this.difficulty,
      prevBlockHash: this.getLatestBlock().blockHash,
    });

    const miningJob = {
      expectedReward: 5000000,
      rewardAddress: minerAddress,
      difficulty: this.difficulty,
      ...block.getMiningJobData(),
    };

    this.miningJobs[minerAddress] = miningJob;
    return miningJob;
  }

  addBlock(blockedMineData) {
    const {
      blockHash, blockDataHash, nonce, dateCreated,
      minedBy, transactions, index, prevBlockHash, difficulty,
    } = blockedMineData;

    // Delete the miningJob created by miner
    // Prepare new block to be added in the main chain

    delete this.miningJobs[minedBy];
    const block = new Block({
      index,
      transactions,
      difficulty,
      prevBlockHash,
      minedBy,
      blockDataHash,
      nonce,
      dateCreated,
      blockHash,
    });

    if (
      Block.calculateBlockDataHash(index, difficulty, transactions, prevBlockHash)
      !== blockDataHash
    ) {
      return new Error('The submitted mined data is invalid');
    }

    if (!Blockchain.isValidBlockHash(blockHash, blockDataHash, dateCreated, nonce)) {
      return new Error('The submitted block has an invalid hash');
    }

    if (!Blockchain.isValidNewBlock(this.getLatestBlock(), block)) {
      return new Error('This is not a valid block');
    }

    if (!Blockchain.isValidHash(blockHash, difficulty)) {
      return new Error('The submitted hash is invalid with the network difficulty');
    }

    // If new block is valid, calculate the new balances of the stateTrie and update it
    // In updating balances, first update the senderValue, then update the recipientValue
    // If not, incorrect balance will occur when sending to your own address

    const updatedStateTrie = new Trie();
    const updatedTransactions = [...this.getConfirmedTransactions(), ...transactions];

    updatedTransactions.forEach((txn) => {
      const {
        from, to, value, fee,
      } = txn;
      if (from !== coinbaseAddress) {
        const senderValue = updatedStateTrie.getValue(from);
        updatedStateTrie.add(from, senderValue - value - fee);
      }
      const recipientValue = updatedStateTrie.getValue(to);
      updatedStateTrie.add(to, recipientValue + value);
    });
    block.stateTrie = updatedStateTrie;

    // Prepare the coinbase transaction and put it in the first index of pendingTransactions
    // Add total fees in the block as reward to the miner

    const minerReward = new Transaction({
      from: coinbaseAddress,
      to: minedBy,
      value: 5000000 + block.getTotalFees(),
      fee: 0,
      dateCreated: new Date().toISOString(),
      data: 'miner reward',
      senderPubKey: '00000000000000000000000000000000000000000000000000000000000000000',
      senderSignature: ['00000000000000000000000000000000000000000000000000000000000000000', '00000000000000000000000000000000000000000000000000000000000000000'],
    });

    // add the block to the chain
    // remove pending transactions that were inside the newly mined block
    // add the coinbase reward as the first transaction for the next block

    this.chain.push(block);
    this.removeFromPendingTransactions(transactions);
    this.addToPendingTransactions(minerReward, { isCoinbase: true });
    return this.getLatestBlock();
  }

  addToPendingTransactions(transaction, options = { isCoinbase: false }) {
    const newTransaction = new Transaction(transaction);
    const { isCoinbase } = options;
    if (isCoinbase) {
      this.pendingTransactions.unshift(newTransaction);
    } else {
      this.pendingTransactions.push(newTransaction);
    }
    return newTransaction;
  }

  removeFromPendingTransactions(transactions) {
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
    if (this.isValidChain(newBlocks) && newBlocks.length > this.chain.length) {
      this.chain = newBlocks;
      console.log('Chain replaced');
    } else {
      console.log('Invalid chain replacement');
    }
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(this.chain[0])) {
      console.log('Genesis block is invalid');
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
