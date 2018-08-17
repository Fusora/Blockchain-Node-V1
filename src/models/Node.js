import BlockSchema from '../schema/BlockSchema';
import Model from './Model';

class Node extends Model {
  constructor(nodeId, selfUrl, peers, chain) {
    this.nodeId = nodeId;
    this.selfUrl = selfUrl;
    this.peers = peers;
    this.blockchain = chain;
  }
  static get schema() {
    return BlockSchema;
  }
}

export default Node;
