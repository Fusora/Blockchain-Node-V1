import address from './address';
import balances from './balances';
import blocks from './blocks';
import debug from './debug';
import info from './info';
import mining from './mining';
import transactions from './transactions';
import peers from './peers';

const setupRouter = (app) => {
  app.use('/address', address);
  app.use('/balances', balances);
  app.use('/blocks', blocks);
  app.use('/debug', debug);
  app.use('/info', info);
  app.use('/mining', mining);
  app.use('/peers', peers);
  app.use('/transactions', transactions);
};

export default setupRouter;
