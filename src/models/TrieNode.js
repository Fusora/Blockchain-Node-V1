class TrieNode {
  constructor(children, value) {
    this.children = new Map(children);
    this.value = value;
  }

  matches(input) {
    let node = null;
    let key = null;
    let index = 0;

    if (!input) return { key, node, index };

    this.children.forEach((child, k) => {
      let i = 1;
      while (input.substring(i) && input.substring(0, i) === k.substring(0, i)) {
        node = child;
        index = i;
        key = k;
        i += 1;
      }
    });
    return { key, node, index };
  }

  addChild(key, node) {
    this.children.set(key, node);
  }

  removeChild(key) {
    this.children.delete(key);
  }

  getChild(key) {
    let child;
    this.children.forEach((c, k) => {
      if (k === key) {
        child = c;
      }
    });
    return child;
  }

  getChildLength() {
    return this.children.size;
  }

  doesChildExist(key) {
    return !!this.children.get(key);
  }
}

export default TrieNode;
