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

    isValidTransaction() {
        if (!(this.isValidHex(this.sender, 40) &&
            this.isValidHex(this.recipient, 40) && 
            this.isValidHex(this.senderPubKey, 65))) {
            return false;
        } else if(!(this.isPositiveNumber(this.value) && 
            this.isPositiveNumber(this.fee))) {
            return false; 
        } else if(this.senderSignature.length !== 2){
            return false;
        }
        return true;
    }
    
    isValidHex(hex, hexLength) {
        if (hex.length != hexLength) {
            return false;
        } 
        return true;
    }

    isPositiveNumber(number) {
        return parseFloat(number) >= 0;
    }
}

export default Transaction;