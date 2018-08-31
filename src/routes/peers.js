import express from 'express';

export default (node) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.send(node.getPeers());
  });

  router.post('/connect', (req, res) => {
    const { peer } = req.body;
    node.connectToPeer(peer);
    res.send(peer);
  });

  return router;
};
