import TrieNode from '../src/models/TrieNode';

describe('TrieNode', () => {
  describe('matches', () => {
    it('Returns a node if input string matches children key', () => {
      const t = new TrieNode([['abc', 'FIRST_NODE'], ['bxa', 'SECOND_NODE'], ['cda', 'THIRD_NODE']]);
      const { node } = t.matches('cccc');
      expect(node).toEqual('THIRD_NODE');
    });

    it('Returns the key value that matches the input string', () => {
      const t = new TrieNode([['abc', 'FIRST_NODE'], ['bxa', 'SECOND_NODE'], ['cda', 'THIRD_NODE']]);
      const { key } = t.matches('bbbbbb');
      expect(key).toEqual('bxa');
    });

    it('Returns the index + 1 of the input string where the match of substring ends', () => {
      const t = new TrieNode([['abc', 'FIRST_NODE'], ['bxa', 'SECOND_NODE'], ['cda', 'THIRD_NODE']]);
      const { index } = t.matches('abcd');
      expect(index).toEqual(3);
    });

    it('It returns the maximum length of the input string if the matching index exceeds input length', () => {
      const t = new TrieNode([['abc', 'FIRST_NODE'], ['bxa', 'SECOND_NODE'], ['cda', 'THIRD_NODE']]);
      const { index: indexOne } = t.matches('a');
      expect(indexOne).toEqual(0);
    });
  });

  describe('getChild', () => {
    it('Gets the children based on key value', () => {
      const t = new TrieNode([['abc', 'FIRST_NODE'], ['bxa', 'SECOND_NODE'], ['cda', 'THIRD_NODE']]);
      expect(t.getChild('bxa')).toEqual('SECOND_NODE');
    });

    it('Returns null if key is not found on children', () => {
      const t = new TrieNode([['abc', 'FIRST_NODE'], ['bxa', 'SECOND_NODE'], ['cda', 'THIRD_NODE']]);
      expect(t.getChild('asdda')).toEqual(undefined);
    });
  });

  describe('addChild', () => {
    it('Adds a chidlren in the node', () => {
      const t = new TrieNode();
      t.addChild('john', 'SOME_CHILD');
      expect(t.getChild('john')).toEqual('SOME_CHILD');
    });
  });

  describe('removeChild', () => {
    it('Removes the child in the children mapping', () => {
      const t = new TrieNode([['abc', 'FIRST_NODE'], ['bxa', 'SECOND_NODE'], ['cda', 'THIRD_NODE']]);
      t.removeChild('bxa');
      expect(t.getChild('bxa')).toEqual(undefined);
    });
  });

  describe('doesChildExist', () => {
    it('Checks if the child exist in the TrieNode', () => {
      const t = new TrieNode([['abc', 'FIRST_NODE'], ['bxa', 'SECOND_NODE'], ['cda', 'THIRD_NODE']]);
      expect(t.doesChildExist('asddas')).toEqual(false);
      expect(t.doesChildExist('abc')).toEqual(true);
    });
  });
});
