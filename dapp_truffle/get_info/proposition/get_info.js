const Web3 = require('web3');
const contractAbi = require('./contract_abi.json');

const INFURA_PROJECT_ID = 'INFURA_PROJECT_ID';
const contractAddr = "0xe16f391e860420e65c659111c9e1601c0f8e2818";

web3 = new Web3(new  Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`));

console.log('Calling Contract.....');

const Contract = new web3.eth.Contract(contractAbi, contractAddr);

Contract.methods.getInfo().call().then(console.log);
