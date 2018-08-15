class Node {
  constructor(nodeId, selfUrl, peers, chain) {
    this.nodeId = nodeId;
    this.selfUrl = selfUrl;
    this.peers = peers;
    this.chain = chain;
  }
}

export default Node;
