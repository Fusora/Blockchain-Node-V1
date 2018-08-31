import express from 'express';

export default (node) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    const info = {
      about: 'Fusora Chain',
      nodeId: node.nodeId,
      nodeUrl: node.selfUrl,
      nodePeers: node.getPeers(),
      confirmedTransactions: node.blockchain.getConfirmedTransactions().length,
      blocks: node.blockchain.chain.length,
    };
    res.send(info);
  });

  return router;
};
