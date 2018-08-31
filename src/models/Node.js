import WebSocket from 'ws';

class Node {
  constructor(nodeId, selfUrl, sockets, chain) {
    this.nodeId = nodeId;
    this.selfUrl = selfUrl;
    this.sockets = sockets || [];
    this.blockchain = chain;
  }

  initWebsocketListeners(ws) {
    ws.on('open', () => {
      this.ws.send('hello');
    });

    ws.on('message', (message) => {
      const msgParsed = JSON.parse(message);
      if (msgParsed.type === 'NEW_CHAIN_RECEIVED') {
        this.blockchain.replaceChain(msgParsed.data);
      }
    });
  }

  connectToPeer(peer) {
    const ws = new WebSocket(peer);
    ws.on('open', () => {
      console.log(`Connected to peer ${peer} --> SUCCESS`);
      this.sockets.push(ws);
    });
    ws.on('error', () => {
      console.log(`Connection to peer ${peer} --> FAILED`);
    });
  }

  getPeers() {
    return this.sockets.map(s => `${s._socket.remoteAddress}:${s._socket.remotePort}`);
  }

  notifyPeers(message) {
    this.sockets.forEach((socket) => {
      socket.send(JSON.stringify(message));
    });
  }
}

export default Node;
