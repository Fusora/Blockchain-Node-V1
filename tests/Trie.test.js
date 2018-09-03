import Trie from '../src/models/Trie';
import TrieNode from '../src/models/TrieNode';

describe('Trie', () => {
  let trie;

  beforeEach(() => {
    trie = new Trie();
  });

  describe('add', () => {
    it('Adds to the root node as children if adress inputted is unique', () => {
      const treeNode = new TrieNode();
      trie.add('0x281055afc982d96fab65b3a49cac8b878184cb16');
      expect(trie.root.children.get('0x281055afc982d96fab65b3a49cac8b878184cb16')).toEqual(treeNode);
      expect(trie.root.children.get('asds')).toEqual(undefined);
    });

    it('Creates a new root based on the equivalent substring of the new input and the previous children input', () => {
      trie.add('0x281055afc982d96fab65b3a49cac8b878184cb16');
      trie.add('0x6f46cf5569aefa1acc1009290c8e043747172d89');
      expect(trie.root.doesChildExist('0x')).toEqual(true);
      expect(trie.root.children.get('0x').doesChildExist('281055afc982d96fab65b3a49cac8b878184cb16'));
      expect(trie.root.children.get('0x').doesChildExist('6f46cf5569aefa1acc1009290c8e043747172d89'));
      trie.add('0b28f46cf5569aefa1acc1009290c8e043747172d89');
      expect(trie.root.doesChildExist('0x')).toEqual(false);
      expect(trie.root.doesChildExist('0')).toEqual(true);
      trie.add('0x289e8709d3215310075d67e3ed32a380ccf451c8');
      expect(trie.root.doesChildExist('0')).toEqual(true);
      expect(trie.root.children.get('0').doesChildExist('x')).toEqual(true);
      expect(trie.root.children.get('0').doesChildExist('b28f46cf5569aefa1acc1009290c8e043747172d89')).toEqual(true);
      trie.add('0b28x46cf5569aefa1acc1009290c8e043747172d89');
      expect(trie.root.children.get('0').doesChildExist('b28f46cf5569aefa1acc1009290c8e043747172d89')).toEqual(false);
      expect(trie.root.children.get('0').doesChildExist('b28')).toEqual(true);
      expect(trie.root.children.get('0').children.get('b28').doesChildExist('x46cf5569aefa1acc1009290c8e043747172d89')).toEqual(true);
      expect(trie.root.children.get('0').children.get('b28').doesChildExist('f46cf5569aefa1acc1009290c8e043747172d89')).toEqual(true);
    });

    it('Adds value of the added string / address', () => {
      trie.add('AAA', 100);
      trie.add('BBB', 200);
      trie.add('CCC', 300);
      expect(trie.root.children.get('AAA').value).toEqual(100);
      expect(trie.root.children.get('BBB').value).toEqual(200);
      expect(trie.root.children.get('CCC').value).toEqual(300);
      trie.add('ABA', 400);
      expect(trie.root.getChildLength()).toEqual(3);
      expect(trie.root.children.get('A').children.get('AA').value).toEqual(100);
      expect(trie.root.children.get('A').children.get('BA').value).toEqual(400);
      trie.add('SOME_RANDOM_STRING', 3);
      expect(trie.root.getChildLength()).toEqual(4);
      expect(trie.root.children.get('SOME_RANDOM_STRING').value).toEqual(3);
      expect(trie.root.children.get('SOME_RANDOM_STRING_1')).toEqual(undefined);
    });
  });

  describe('find', () => {
    it('Returns the node that matches the string input', () => {
      trie.add('AAA', 2332);
      trie.add('BBB', 200);
      trie.add('CCC', 300);
      trie.add('0b28x46cf5569aefa1acc1009290c8e043747172d89');
      expect(trie.find('AAA')).toEqual({ children: new Map(), value: 2332 });
      expect(trie.find('BBB')).toEqual({ children: new Map(), value: 200 });
      expect(trie.find('CCC')).toEqual({ children: new Map(), value: 300 });
      expect(trie.find('0b28x46cf5569aefa1acc1009290c8e043747172d89')).toEqual({ children: new Map(), value: undefined });
      trie.add('ABA', 232);
      expect(trie.find('A')).toEqual({ children: new Map([['AA', new TrieNode(null, 2332)], ['BA', new TrieNode(null, 232)]]), value: undefined });
    });
  });

  describe('getAllValues', () => {
    it('Returns all the values in the Trie', () => {
      trie.add('AAA', 2332);
      trie.add('BBB', 200);
      trie.add('CCC', 300);
      expect(trie.getAllValues()).toEqual({ AAA: 2332, BBB: 200, CCC: 300 });
    });
  });
});
