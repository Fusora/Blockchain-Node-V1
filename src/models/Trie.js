import TrieNode from './TrieNode';

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  add(input, value, node = this.root) {
    const {
      node: matchedNode, key, index,
    } = node.matches(input);

    if (matchedNode) {
      const shouldUpdateNodeLink = key.length > index;
      if (shouldUpdateNodeLink) {
        const newNode = new TrieNode();
        node.removeChild(key);
        newNode.addChild(key.substring(index), matchedNode);
        node.addChild(input.substring(0, index), newNode);
        return this.add(input.substring(index), value, newNode);
      }
      return this.add(input.substring(index), value, matchedNode);
    }

    node.addChild(input, new TrieNode(null, value));
    return node;
  }

  find(input, node = this.root) {
    const { node: matchedNode, index } = node.matches(input);

    if (node.getChild(input)) {
      return node.getChild(input);
    }

    if (matchedNode) {
      return this.find(input.substring(index), matchedNode);
    }

    return matchedNode;
  }
}

export default Trie;
