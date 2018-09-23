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

    const PENDING_BALANCES_CONFIRMATIONS = 0;
    const CONFIRMED_BALANCES_CONFIRMATIONS = 2;
    const SAFE_BALANCES_CONFIRMATIONS = 6;

    if (!addressSchema.validate(address).error) {
      res.status(200).send({
        address,
        balance: {
          pending: node.blockchain.getBalance(address, { confirmations: PENDING_BALANCES_CONFIRMATIONS }),
          confirmed: node.blockchain.getBalance(address, { confirmations: CONFIRMED_BALANCES_CONFIRMATIONS }),
          safe: node.blockchain.getBalance(address, { confirmations: SAFE_BALANCES_CONFIRMATIONS }),
        },
      });
    } else {
      res.status(400).send({ error: 'Invalid address sent' });
    }
  });

  return router;
};
