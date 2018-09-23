import WebSocket from 'ws';
import Blockchain from './Blockchain';

class Node {
  constructor(props) {
    const {
      nodeId, selfUrl, socketUrl, sockets, blockchain,
    } = props;
    this.nodeId = nodeId;
    this.selfUrl = selfUrl;
    this.socketUrl = socketUrl;
    this.sockets = sockets || [];
    this.blockchain = blockchain;
  }

  initWebsocketListeners(ws) {
    ws.on('open', () => {
      this.ws.send('hello');
    });

    ws.on('message', (message) => {
      const msgParsed = JSON.parse(message);
      if (msgParsed.type === 'NEW_CHAIN_RECEIVED') {
        if (JSON.stringify(this.blockchain.chain) === JSON.stringify(msgParsed.data)) {
          return;
        }

        /*
          The order of this is very important, first replace the chain
          Then broadcast the new chain on the network
        */

        this.blockchain.replaceChain(msgParsed.data);
        this.broadcastChain();
      } else if (msgParsed.type === 'CHAIN_RESET') {
        this.resetChain();
      } else if (msgParsed.type === 'CONNECT_BACK') {
        try {
          this.connectToPeer(msgParsed.peer);
        } catch (e) {
          console.log(e.toString());
        }
      }
    });
  }

  connectToPeer(peer) {
    if (this.getPeers().includes(peer)) {
      throw new Error('Peer is already connected');
    }

    const ws = new WebSocket(peer);
    ws.on('open', () => {
      this.sockets.push(ws);
      ws.send(JSON.stringify({ type: 'CONNECT_BACK', peer: this.socketUrl }));
    });
    ws.on('error', () => {
    });
  }

  getPeers() {
    return this.sockets.map(s => s.url);
  }

  notifyPeers(message) {
    this.sockets.forEach((socket) => {
      socket.send(JSON.stringify(message));
    });
  }

  broadcastChain() {
    this.notifyPeers({
      type: 'NEW_CHAIN_RECEIVED',
      data: this.blockchain.chain,
    });
  }

  resetChain() {
    this.blockchain = new Blockchain();
  }

  reset() {
    this.resetChain();
    this.notifyPeers({ type: 'CHAIN_RESET' });
  }
}

export default Node;
