import express from 'express';
import bodyParser from 'body-parser';
import WebSocket from 'ws';
import uuid from 'uuid/v4';
import setupRouter from './routes/routes';
import Node from './models/Node';
import Blockchain from './models/Blockchain';
import handleException from './handleException';

const app = express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

const NODE_INDEX = Number(process.argv.slice(2)) || 0;
const PORT = process.env.PORT || 3000 + NODE_INDEX;
const WS_PORT = process.env.WS_PORT || 6000 + NODE_INDEX;

const wss = new WebSocket.Server({ port: WS_PORT });

// instantiate the blockchain and node
// pass the node instance to the routes
const blockchain = new Blockchain();
const node = new Node(uuid(), `http://localhost:${PORT}`, null, blockchain);

wss.on('connection', (ws) => {
  node.initWebsocketListeners(ws);
});

// initializes routes for rest api
setupRouter(app, node);
handleException();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Running Fusora Node Number ${NODE_INDEX}`);
  console.log(`On HTTP_PORT: http://localhost:${PORT}`);
  console.log(`Peer to peer port: ${WS_PORT}`);
});
