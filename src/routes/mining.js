import express from 'express';

export default (node) => {
  const router = express.Router();
  const networkDifficulty = node.blockchain.difficulty;

  router.get('/get-mining-job/:address', (req, res) => {
    const { address } = req.params;
    const miningJob = node.blockchain.getMiningJob();

    if (miningJob) {
      const miningJobData = {
        transactions: miningJob.transactions,
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

    // if submitted mined block is valid, send the new chain to connected peers
    const block = node.blockchain.addBlock(minedBlock);

    if (!(block instanceof Error)) {
      node.notifyPeers({
        type: 'NEW_CHAIN_RECEIVED',
        data: node.blockchain.chain,
      });
      res.status(200).send(minedBlock);
    } else {
      res.status(400).send({ error: 'The block submitted is invalid' });
    }
  });

  return router;
};
