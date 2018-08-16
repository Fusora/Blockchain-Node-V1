import express from 'express';

export default (node) => {
  const router = express.Router();

  router.get('/', (req, res) => {

  });

  router.post('/connect', (req, res) => {

  });

  router.post('/notify-new-block', (req, res) => {

  });

  return router;
};
