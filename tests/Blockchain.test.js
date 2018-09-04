import Blockchain from '../src/models/Blockchain';
import Block from '../src/models/Block';

describe.only('Blockchain', () => {
  let blockchain;
  const coinbaseAddress = '0000000000000000000000000000000000000000';
  const genesisHash = '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7';

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  describe('addBlock', () => {
    it('Adds a new block in the chain', () => {
      const transactions = [];
      const index = 1;
      const difficulty = 4;
      const prevBlockHash = genesisHash;
      const dateCreated = '2018-09-03T12:56:10.736Z';
      const nonce = 8442;
      const blockDataHash = 'fb0a9b872db3deec4cedb5c965935c1f3bb564740f60259397ad695aa38e6ff3';
      const blockHash = '00002d4b49dba1d64457d06e2d0796213b19b39e7fc9743d7cad8be46c786c25';

      const mineData = {
        blockHash,
        prevBlockHash,
        dateCreated,
        nonce,
        blockDataHash,
        transactions,
        difficulty,
        index,
      };

      expect(blockchain.addBlock(mineData).blockHash).toEqual(blockHash);
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
      const confirmedTransactions = [{}, {}, {}, {}];
      blockchain.chain = [{ transactions: confirmedTransactions }];
      expect(blockchain.getConfirmedTransactions()).toEqual(confirmedTransactions);
    });
  });

  describe('getTransaction', () => {
    it('Returns the transaction based on the transaction hash', () => {
      blockchain.chain = [
        {
          transactions: [{ transactionDataHash: 'AAAA' }],
        },
        {
          transactions: [{ transactionDataHash: 'BBBBAC' }],
        },
      ];
      expect(blockchain.getTransaction('AAAA')).toEqual(blockchain.chain[0].transactions[0]);
    });
  });
});
