import express from 'express';

export default (node) => {
  const router = express.Router();

  router.get('/:address/transactions', (req, res) => {
    const { address } = req.params;

    if (address) {
      const transactions = node.blockchain.getTransactionsByAddress(address);
      res.status(200).send(transactions);
    } else {
      res.status(400).send({ error: 'Invalid address sent' });
    }
  });

  router.get('/:address/balance', (req, res) => {
    const { address } = req.params;

    if (address) {
      const balance = node.blockchain.getBalance(address);
      res.status(200).send({ address, balance });
    } else {
      res.status(400).send({ error: 'Invalid address sent' });
    }
  });

  return router;
};
