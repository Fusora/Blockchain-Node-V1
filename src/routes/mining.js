import express from 'express';

export default (node) => {
  const router = express.Router();

  router.get('/get-mining-job/:address', (req, res) => {

  });

  router.post('/submit-mined-block', (req, res) => {

  });

  return router;
};
