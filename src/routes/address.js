import express from 'express';
import addressSchema from '../schema/AddressSchema';

export default (node) => {
  const router = express.Router();

  router.get('/:address/transactions', (req, res) => {
    const { address } = req.params;

    if (!addressSchema.validate(address).error) {
      const transactions = node.blockchain.getTransactionsByAddress(address);
      res.status(200).send({ transactions, address });
    } else {
      res.status(400).send({ error: 'Invalid address sent' });
    }
  });

  router.get('/:address/balance', (req, res) => {
    const { address } = req.params;

    if (!addressSchema.validate(address).error) {
      const balance = node.blockchain.getBalance(address);
      res.status(200).send({ address, balance });
    } else {
      res.status(400).send({ error: 'Invalid address sent' });
    }
  });

  return router;
};
