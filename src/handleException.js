export default () => process.on('uncaughtException', (err) => {
  if (err.errno === 'EADDRINUSE') {
    console.log('--------------------');
    console.log('The ports you are trying to run is already in use');
    console.log('To run a new node instance on a different port,');
    console.log('Try running npm run node {index_number}');
    console.log('--------------------');
  } else { console.log(err); }
  process.exit(1);
});
