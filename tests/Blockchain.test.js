import Blockchain from '../src/models/Blockchain';
import Block from '../src/models/Block';

describe('Blockchain', () => {
  let blockchain;
  const genesisHash = '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7';
  const coinbaseAddress = '0000000000000000000000000000000000000000';


  beforeEach(() => {
    blockchain = new Blockchain();
  });

  describe('addBlock', () => {
    it('Adds a new block in the chain', () => {
      const blockDataHash = '33a4ac76e7b5f579854c842144da482073e650cd6b45e693c5c353a4c3da6f8e';
      const dateCreated = '2018-08-19T14:37:16.114Z';
      const nonce = 123;
      const mineData = {
        blockHash: Block.calculateHash(blockDataHash, dateCreated, nonce),
        dateCreated,
        nonce,
        blockDataHash,
      };
      blockchain.getMiningJob();
      blockchain.addBlock(mineData, 0);
      expect(blockchain.chain.length).toEqual(2);
    });

    it('Doesnt add the new block if the previousHash is incorrect', () => {
      blockchain.getMiningJob().prevBlockHash = '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d8';
      const blockDataHash = '33a4ac76e7b5f579854c842144da482073e650cd6b45e693c5c353a4c3da6f8e';
      const dateCreated = '2018-08-19T14:37:16.114Z';
      const nonce = 123;
      const mineData = {
        blockHash: Block.calculateHash(blockDataHash, dateCreated, nonce),
        dateCreated,
        nonce,
        blockDataHash,
      };
      const res = blockchain.addBlock(mineData);
      expect(res).toBeInstanceOf(Error);
      expect(blockchain.chain.length).toEqual(1);
    });

    it('Doesnt add the new block if blockHash is invalid or data is tampered', () => {
      blockchain.getMiningJob();
      const blockDataHash = '33a4ac76e7b5f579854c842144da482073e650cd6b45e693c5c353a4c3da6f8e';
      const dateCreated = '2018-08-19T14:37:16.114Z';
      const nonce = 123;
      const mineData = {
        blockHash: Block.calculateHash('asdads', dateCreated, nonce),
        dateCreated,
        nonce,
        blockDataHash,
      };
      const res = blockchain.addBlock(mineData, 0);
      expect(res).toBeInstanceOf(Error);
      expect(blockchain.chain.length).toEqual(1);
    });

    it('Doesnt add the new block if blockHash is not equal to difficulty concensus', () => {
      const blockDataHash = '33a4ac76e7b5f579854c842144da482073e650cd6b45e693c5c353a4c3da6f8e';
      const dateCreated = '2018-08-19T14:37:16.114Z';
      const nonce = 123;
      const mineData = {
        blockHash: Block.calculateHash(blockDataHash, dateCreated, nonce),
        dateCreated,
        nonce,
        blockDataHash,
      };
      blockchain.getMiningJob();
      const res = blockchain.addBlock(mineData, 4);
      expect(res).toBeInstanceOf(Error);
      expect(blockchain.chain.length).toEqual(1);
    });
  });

  describe('getConfirmedTransactions', () => {
    it('Gets all the transactions that are in the blocks', () => {
      const blockDataHash1 = '33a4ac76e7b5f579854c842144da482073e650cd6b45e693c5c353a4c3da6f8e';
      const dateCreated1 = '2018-08-19T14:37:16.114Z';
      const nonce1 = 123;
      const mineData1 = {
        blockHash: Block.calculateHash(blockDataHash1, dateCreated1, nonce1),
        dateCreated: dateCreated1,
        nonce: nonce1,
        blockDataHash: blockDataHash1,
      };


      blockchain.addTransaction({});
      blockchain.addTransaction({});
      blockchain.addTransaction({});
      blockchain.getMiningJob();
      blockchain.addBlock(mineData1, 0);

      const blockDataHash2 = '33a4ac76e7b5f579854c842144da482073e650cd6b45e693c5c353a4c3da6f8e';
      const dateCreated2 = '2018-08-19T14:37:16.114Z';
      const nonce2 = 123;
      const mineData2 = {
        blockHash: Block.calculateHash(blockDataHash2, dateCreated2, nonce2),
        dateCreated: dateCreated2,
        nonce: nonce2,
        blockDataHash: blockDataHash2,
      };

      blockchain.addTransaction({});
      blockchain.getMiningJob();
      blockchain.addBlock(mineData2, 0);

      expect(blockchain.chain.length).toEqual(3);
      expect(blockchain.getConfirmedTransactions().length).toEqual(4 + 1);
      expect(blockchain.pendingTransactions[0].from).toEqual(coinbaseAddress);
    });
  });

  describe('getTransaction', () => {
    it('Returns the transaction based on the transaction hash', () => {
      const blockDataHash = '33a4ac76e7b5f579854c842144da482073e650cd6b45e693c5c353a4c3da6f8e';
      const dateCreated = '2018-08-19T14:37:16.114Z';
      const nonce = 123;
      const mineData = {
        blockHash: Block.calculateHash(blockDataHash, dateCreated, nonce),
        dateCreated,
        nonce,
        blockDataHash,
      };

      blockchain.addTransaction({ from: 'some guy' });
      blockchain.addTransaction({ from: 'some potato' });
      blockchain.addTransaction({ from: 'secret' });
      blockchain.getMiningJob();
      blockchain.addBlock(mineData, 0);

      expect(blockchain.pendingTransactions.length).toEqual(1);
      expect(blockchain.chain.length).toEqual(2);
      expect(blockchain.getConfirmedTransactions().length).toEqual(3);
      expect(blockchain.getTransaction('0xa50d5d37c9b94c63e4b26bcfd0130d0501276dc0a5c37409e051dcdb7b6289d3').from).toEqual('some guy');
    });
  });
});
