const Block = require('./Block');
let privateProperty = new WeakMap();

class Blockchain {
    constructor(currentDifficulty){
        this.chain = [];
        this.difficulty = currentDifficulty;
    };

    generateGenesisBlock() {
        const genesisBlock = new Block(0, "0", 1465154705, "my genesis block", 0, "0000000000000000000000000000000000000000", 0, "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7")
        if (!this.chain.includes(genesisBlock)) {
            privateProperty.set(this, { genesisBlock });
            this.chain.push(genesisBlock);
        }
    };

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }; 

    addBlock(newBlock) {
        this.isValidNewBlock(this.getLatestBlock(), newBlock) && this.chain.push(newBlock);
    }

    replaceChain(newBlocks) {
        if (this.isValidChain(newBlocks) && newBlocks.length > this.chain.length) {
            this.chain = newBlocks;
        } else {
            console.log('Invalid chain replacement');
        }
    }

    isValidChain(chain) {
        if(chain[0] !== privateProperty.get(this).genesisBlock) {
            return false;
        }
        const tempBlock = [chain[0]];
        for(let i = 1; i < chain.length; i++) {
            if (this.isValidNewBlock(tempBlock[i - 1], chain[i])) {
                tempBlock.push(chain[i]);
            } else {
                return false;
            }
        }
        return true;
    }

    isValidNewBlock(previousBlock, newBlock) {
        if (previousBlock.index + 1 !== newBlock.index){
            return false;
        } else if (previousBlock.hash !== newBlock.previousHash) {
            return false;
        } 
        return true;
    }
}

module.exports = Blockchain;