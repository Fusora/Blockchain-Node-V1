import asyncio, requests, json, hashlib, binascii, np
from multiprocessing.dummy import Pool as ThreadPool
from time import time

validAddress = 'a44f70834a711F0DF388ab016465f2eEb255dEd0'.lower()
pool = ThreadPool(14)

def getJobs(address):
    jobs = requests.get('https://stormy-everglades-34766.herokuapp.com/mining/get-mining-job/'+address)
    result = jobs.json()
    return result

def calculateHash(blockDataHash, timestamp, nonce):
    data = str(blockDataHash) + "|" + str(timestamp) + "|" + str(nonce)
    return binascii.hexlify(hashlib.new('sha256', data.encode('utf8')).digest()).decode('utf8')

def mine(blockData):
    timestamp = int(round(time()))/1000
    blockDataHash = blockData['blockDataHash']
    difficulty = blockData['difficulty']
    nonce = 0
    hash = calculateHash(blockDataHash, timestamp, nonce)
    while(hash[0:difficulty] != ''.join(str(x) for x in np.zeros(difficulty, int))):
        nonce = nonce + 1
        timestamp = int(round(time()))/1000
        hash = calculateHash(blockDataHash, timestamp, nonce)
        print(str(nonce) + "\t=>\t" + str(hash))
    print('\nSuccessful: '+str(hash))

# mine(getJobs(validAddress))
blockData = getJobs(validAddress)
mine(blockData)