class Transaction {
    constructor(sender, recipient, value, fee, dateCreated, data, senderPubKey, transactionDataHash, senderSignature) {
        this.sender = sender;
        this.recipient = recipient;
        this.value = value;
        this.fee = fee;
        this.dateCreated = dateCreated;
        this.data = data;
        this.senderPubKey = senderPubKey;
        this.transactionDataHash = transactionDataHash;
        this.senderSignature = senderSignature;
    }

    isValidTransaction = () => {
        if (this.isValidHex(this.sender, 40) && this.isValidHex(this.recipient, 40)) {

        } else if(this.isPositiveNumber(this.value) && this.isPositiveNumber(this.fee)){

        }
    }
    
    isValidHex = (hex, hexLength) => {
        if (hex.length != hexLength) {
            return false;
        } 
        return true;
    }

    isPositiveNumber = (number) => {
        return parseFloat(number) >= 0;
    }
}

export default Transaction;