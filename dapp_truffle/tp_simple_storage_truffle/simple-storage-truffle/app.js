require('dotenv').config();
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const simpleStorageAbi = require('./build/contracts/SimpleStorage.json').abi;

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

const ROPSTEN_SIMPLE_STORAGE_ADDR = '';
const RINKEBY_SIMPLE_STORAGE_ADDR = '';

getSimpleStorageData('ropsten', ROPSTEN_SIMPLE_STORAGE_ADDR);
getSimpleStorageData('rinkeby', RINKEBY_SIMPLE_STORAGE_ADDR);

function getSimpleStorageData(network, contractAddr) {
    console.log('network :', network);

    let provider = new HDWalletProvider({
      providerOrUrl: `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`
    });
    
    const web3 = new Web3(provider);
    
    const SimpleStorageContract = new web3.eth.Contract(simpleStorageAbi, contractAddr);

    SimpleStorageContract.methods.get().call().then(console.log);
}
