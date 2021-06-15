const Web3 = require('web3');
const contractAbi = require('./contract_abi.json');

const INFURA_PROJECT_ID = 'INFURA_PROJECT_ID';
const contractAddr = "0x8cD906ff391b25304E0572b92028bE24eC1eABFb";

web3 = new Web3(new  Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`));

console.log('Calling Contract.....');

const Contract = new web3.eth.Contract(contractAbi, contractAddr);

Contract.methods.get().call().then(console.log);
