import express from 'express';

export default (node) => {
  const router = express.Router();

  router.get('/:address/transactions', (req, res) => {
    res.status(200).send({ firstname: 'congrates!' });
  });

  router.get('/:address/balance', (req, res) => {
    res.status(200).send(node);
  });

  return router;
};
