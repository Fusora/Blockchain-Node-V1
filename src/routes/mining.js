import express from 'express';

export default (node) => {
  const router = express.Router();
  const networkDifficulty = node.blockchain.difficulty;

  router.get('/get-mining-job/:address', (req, res) => {
    const { address } = req.params;
    const miningJob = node.blockchain.getMiningJob();

    if (miningJob) {
      const miningJobData = {
        transactionsIncluded: miningJob.transactions.length,
        expectedReward: 5000000,
        rewardAddress: address,
        ...miningJob,
        difficulty: networkDifficulty,
      };
      res.status(200).send(miningJobData);
    } else {
      res.status(400).send({ error: 'Error in finding a mining job' });
    }
  });

  router.post('/submit-mined-block', (req, res) => {
    const minedBlock = req.body;

    if (!(node.blockchain.addBlock(minedBlock, networkDifficulty) instanceof Error)) {
      res.status(200).send(minedBlock);
    } else {
      res.status(400).send({ error: 'The block submitted is invalid' });
    }
  });

  return router;
};
