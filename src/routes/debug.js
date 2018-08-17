import express from 'express';

export default (node) => {
  const router = express.Router();

  router.get('/', (req, res) => {

  });

  router.get('/reset-chain', (req, res) => {

  });

  router.get('/mine/:minerAddress/:difficulty', (req, res) => {

  });

  return router;
};
