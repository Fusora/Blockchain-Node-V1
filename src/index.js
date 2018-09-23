import express from 'express';
import bodyParser from 'body-parser';
import WebSocket from 'ws';
import uuid from 'uuid/v4';
import cors from 'cors';
import setupRouter from './routes/routes';
import Node from './models/Node';
import Blockchain from './models/Blockchain';
import handleException from './handleException';

const app = express()
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors());

const HOST_NAME = process.env.HOST_URL || 'http://localhost';
const NODE_INDEX = Number(process.argv.slice(2)) || 0;
const PORT = process.env.PORT || 3000 + NODE_INDEX;
const WS_PORT = process.env.WS_PORT || 6000 + NODE_INDEX;

const wss = new WebSocket.Server({ port: WS_PORT });


// Instantiate the blockchain and node
// Pass the node instance to the routes
const blockchain = new Blockchain();
const node = new Node({
  nodeId: uuid(),
  selfUrl: `${HOST_NAME}:${PORT}`,
  socketUrl: `${HOST_NAME}:${WS_PORT}`,
  blockchain,
});

wss.on('connection', (ws) => {
  node.initWebsocketListeners(ws);
});

// Initializes routes for rest api
setupRouter(app, node);
handleException();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Running Fusora Node Number ${NODE_INDEX}`);
  console.log(`On HTTP_PORT: ${HOST_NAME}:${PORT}`);
  console.log(`Peer to peer port: ${WS_PORT}`);
});
