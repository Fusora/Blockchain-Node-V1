import express from 'express';
import addressSchema from '../schema/AddressSchema';

export default (node) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    const debugInfo = {
      selfUrl: node.selfUrl,
      networkDifficulty: node.blockchain.difficulty,
      peers: node.getPeers(),
      chain: {
        blocks: node.blockchain.chain,
        pendingTransactions: node.blockchain.pendingTransactions,
        transactions: node.blockchain.getConfirmedTransactions(),
        miningJobs: node.blockchain.miningJobs,
      },

    };
    res.status(200).send(debugInfo);
  });

  router.post('/reset-chain', (req, res) => {
    const { secretKey } = req.body;

    if (secretKey === 'masterhacker666') {
      node.reset();
      res.status(200).send({ message: 'Fusora chain is reset. That is evil, bro' });
    } else {
      res.status(400).send({ error: 'Invalid secret key sent' });
    }
  });

  router.get('/mine/:minerAddress/:difficulty', (req, res) => {
    const { minerAddress, difficulty } = req.params;

    if (minerAddress.validate(minerAddress).error || !difficulty) {
      res.status(400).send({ error: 'Invalid data sent.' });
    } else {
      const miningJob = node.blockchain.miningJobs[minerAddress];
      if (miningJob) {
        res.status(200).send(miningJob);
      } else {
        res.status(400).send({ error: 'Mining job does not exist' });
      }
    }
  });

  return router;
};
