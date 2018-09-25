# Fusora Chain
![Logo](https://res.cloudinary.com/depjh17m6/image/upload/c_scale,w_157/v1537890170/39026789_263502377804637_6055300130922299392_n_z6oq78.png)
## About
Fusora chain is a simple blockchain implementation created with NodeJS

Live node: http://fusora.herokuapp.com
### Get started
* npm run install
* npm run node [integer value] //*simulate blockchain p2p network by creating nodes and connecting them to each other*
### Blockchain Protocol
* Private public keypair generation uses ECC and is the same with the Ethereum implementation
* Allows peer synchronization of nodes through websockets using the ghost protocol
* If a node connects to the network, it is given peer suggestions based on other nodes that are live.
* The blockchain data is stored using leveldb. Once a node goes offline, and starts to reconnect back to the network, the local data will be first verified and then synched until it is up to date with the network
* Minimum transaction fee is 5000 mfsr-coins
* Transactions with higher fees are given priority 
* Network difficulty is dynamic which is calculated by the current block time vs the average block time. Average time for a new block to be created is 12 seconds.
* Account balances are stored in a trie and each block has its own Trie data. The latest balance is taken from the latest block.
### Api Documentation
[Click here](./docs/API.md)
