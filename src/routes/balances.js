import express from 'express';

export default (node) => {
  const router = express.Router();

  const PENDING_BALANCES_CONFIRMATIONS = 0;
  const CONFIRMED_BALANCES_CONFIRMATIONS = 2;
  const SAFE_BALANCES_CONFIRMATIONS = 6;

  router.get('/', (req, res) => {
    res.status(200).send({
      pendingBalances: node.blockchain.getBalances({ confirmations: PENDING_BALANCES_CONFIRMATIONS }),
      confirmedBalances: node.blockchain.getBalances({ confirmations: CONFIRMED_BALANCES_CONFIRMATIONS }),
      safeBalances: node.blockchain.getBalances({ confirmations: SAFE_BALANCES_CONFIRMATIONS }),
    });
  });

  router.get('/pending', (req, res) => {
    res.status(200).send(node.blockchain.getBalances({ confirmations: PENDING_BALANCES_CONFIRMATIONS }));
  });

  router.get('/confirmed', (req, res) => {
    res.status(200).send(node.blockchain.getBalances({ confirmations: CONFIRMED_BALANCES_CONFIRMATIONS }));
  });

  router.get('/safe', (req, res) => {
    res.status(200).send(node.blockchain.getBalances({ confirmations: SAFE_BALANCES_CONFIRMATIONS }));
  });

  return router;
};
