import express from 'express';

export default (node) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.status(200).send(node.blockchain.getBalances());
  });

  return router;
};
