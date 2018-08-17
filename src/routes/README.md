The REST API for the Fusora network.

GET /
GET /info
GET /debug
GET /debug/reset-chain
GET /debug/mine/:minerAddress/:difficulty
GET /blocks
GET /blocks/:index
GET /transactions/pending
GET /transactions/confirmed
GET /transactions/:tranHash
GET /balances
GET /address/:address/transactions
GET /address/:address/balance
POST /transactions/send
GET /peers
POST /peers/connect
POST /peers/notify-new-block
GET /mining/get-mining-job/:address
POST /mining/submit-mined-block