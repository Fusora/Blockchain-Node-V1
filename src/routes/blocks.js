import express from 'express';

export default (node) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.status(200).send(node.blockchain.chain);
  });

  router.get('/:index', (req, res) => {
    const {
      params: { index },
    } = req;

    if (Number(index) < node.blockchain.chain.length) {
      res.status(200).send(node.blockchain.chain[index]);
    } else {
      res.status(400).send({ error: 'Block is invalid' });
    }
  });

  return router;
};
