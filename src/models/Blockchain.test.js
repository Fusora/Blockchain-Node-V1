import Blockchain from './Blockchain';
import Block from './Block';

describe('Blockchain', () => {
  let blockchain;
  const genesisHash = '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7';

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  describe('addBlock', () => {
    it('Adds a new block in the chain', () => {
      const newBlock = new Block(
        1,
        undefined,
        4,
        genesisHash,
        null,
      );
      blockchain.addBlock(newBlock);

      expect(blockchain.chain.length).toEqual(2);
    });

    it('Doesnt add the new block if the previousHash is incorrect', () => {
      const newBlock = new Block(
        1,
        undefined,
        4,
        '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d8',
        null,
      );
      blockchain.addBlock(newBlock);
      expect(blockchain.chain.length).toEqual(1);
    });
  });

  describe('getConfirmedTransactions', () => {
    it('Gets all the transactions that are in the blocks', () => {
      const block1 = new Block(
        1,
        [{}, {}, {}],
        4,
        genesisHash,
        '84ede81c58f5c490fc6e1a3035789eef897b5b35',
        null,
        20,
        new Date().toISOString(),
        '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f780',
      );
      const block2 = new Block(
        2,
        [{}],
        4,
        '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f780',
        '84ede81c58f5c490fc6e1a3035789eef897b5b35',
      );

      blockchain.addBlock(block1);
      blockchain.addBlock(block2);
      expect(blockchain.chain.length).toEqual(3);
      expect(blockchain.getConfirmedTransactions().length).toEqual(4);
    });
  });

  describe('getTransaction', () => {
    it('Returns the transaction based on the transaction hash', () => {
      const block = new Block(
        1,
        [
          { transactionDataHash: '123', sender: 'some guy' },
          { transactionDataHash: '222', sender: 'some potato' },
          { transactionDataHash: '444', sender: 'secret' }],
        4,
        genesisHash,
        '84ede81c58f5c490fc6e1a3035789eef897b5b35',
      );
      blockchain.addBlock(block);
      expect(blockchain.chain.length).toEqual(2);
      expect(blockchain.getTransaction('123').sender).toEqual('some guy');
    });
  });
});
