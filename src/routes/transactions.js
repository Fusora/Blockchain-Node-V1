import express from 'express';
import transactionSchema from '../schema/TransactionSchema';

export default (node) => {
  const router = express.Router();

  router.get('/pending', (req, res) => {
    res.status(200).send(node.blockchain.pendingTransactions);
  });

  router.get('/confirmed', (req, res) => {
    const confirmedTransactions = node.blockchain.getConfirmedTransactions();

    if (confirmedTransactions) {
      res.status(200).send(confirmedTransactions);
    } else {
      res.status(400).send({ message: 'An error has occured in finding confirmed transactions' });
    }
  });

  router.get('/:transactionHash', (req, res) => {
    const { params: { transactionHash } } = req;
    const transaction = node.blockchain.getTransaction(transactionHash);

    if (transaction) {
      res.status(400).send(transaction);
    } else {
      res.status(200).send({ message: 'Unable to find transaction based on transactionHash' });
    }
  });

  router.post('/send', (req, res) => {
    const transactionData = req.body;
    const transactionError = transactionSchema.validate(transactionData).error;

    if (transactionError) {
      res.status(400).send({ error: transactionError });
      return res.end();
    }

    const transaction = node.blockchain.addToPendingTransactions(transactionData);

    if (transaction) {
      res.status(200).send(transaction);
    } else {
      res.status(400).send({ message: 'An error has occured in submitting a transaction' });
    }
  });

  return router;
};
