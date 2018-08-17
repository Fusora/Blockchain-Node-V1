import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'uuid/v4';
import setupRouter from './routes/routes';
import Node from './models/Node';
import Blockchain from './models/Blockchain';

const app = express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// instantiate the blockchain and node
// pass the node instance to the routes

const blockchain = new Blockchain();
const node = new Node(uuid(), `http://localhost:${port}`, null, blockchain);

// initializes routes for rest api
setupRouter(app, node);

app.listen(port, () => console.log(`Running Fusora node on: ${port}`));
