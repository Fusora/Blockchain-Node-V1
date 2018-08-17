import express from 'express';

export default (node) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.send('Info api');
  });

  return router;
};
