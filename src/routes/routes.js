import address from './address';
import balances from './balances';
import blocks from './blocks';
import debug from './debug';
import info from './info';
import mining from './mining';
import transactions from './transactions';
import peers from './peers';

const setupRouter = (app, node) => {
  app.use('/address', address(node));
  app.use('/balances', balances(node));
  app.use('/blocks', blocks(node));
  app.use('/debug', debug(node));
  app.use('/info', info(node));
  app.use('/mining', mining(node));
  app.use('/peers', peers(node));
  app.use('/transactions', transactions(node));
};

export default setupRouter;
