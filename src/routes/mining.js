import express from 'express';
import addressSchema from '../schema/AddressSchema';
import blockSchema from '../schema/BlockSchema';

export default (node) => {
  const router = express.Router();

  router.get('/get-mining-job/:address', (req, res) => {
    const { address } = req.params;

    if (addressSchema.validate(address).error) {
      res.status(400).send({ error: 'Invalid or no address sent' });
      return res.end();
    }

    const miningJob = node.blockchain.takeMiningJob(address);

    if (miningJob) {
      res.status(200).send(miningJob);
    } else {
      res.status(400).send({ error: 'No mining job found' });
    }
  });

  router.post('/submit-mined-block', (req, res) => {
    const minedBlock = req.body;
    const validationError = blockSchema.validate(minedBlock).error;

    if (validationError) {
      res.status(400).send({ error: validationError });
      return res.end();
    }

    const block = node.blockchain.addBlock(minedBlock);

    if (!(block instanceof Error)) {
      node.broadcastChain();
      res.status(200).send(minedBlock);
    } else {
      res.status(400).send({ error: 'The block submitted is invalid' });
    }
  });

  return router;
};
