import WebSocket from 'ws';

class Node {
  constructor(nodeId, selfUrl, sockets, chain) {
    this.nodeId = nodeId;
    this.selfUrl = selfUrl;
    this.sockets = sockets || [];
    this.blockchain = chain;
  }

  connectToPeer(peer) {
    const ws = new WebSocket(peer);
    ws.on('open', () => {
      console.log(`Connected to peer ${peer} --> SUCCESS`);
      this.initConnection(ws);
    });
    ws.on('error', () => {
      console.log(`Connection to peer ${peer} --> FAILED`);
    });
  }

  initConnection(ws) {
    this.sockets.push(ws);
  }

  getPeers() {
    return this.sockets.map(s => `${s._socket.remoteAddress}:${s._socket.remotePort}`);
  }
}

export default Node;
