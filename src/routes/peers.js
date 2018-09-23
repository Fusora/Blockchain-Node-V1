import express from 'express';

export default (node) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.send(node.getPeers());
  });

  router.post('/connect', (req, res) => {
    const { peer } = req.body;
    try {
      node.connectToPeer(peer);
      res.status(200).send({ message: 'Successfully connected to peer', peer });
    } catch (e) {
      if (e.toString().includes('Peer is already connected')) {
        res.status(400).send({ error: 'Peer is already connected' });
      }
    }
  });

  return router;
};
