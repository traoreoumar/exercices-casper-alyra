const Web3 = require('web3');
const contractAbi = require('./contract_abi.json');

const INFURA_PROJECT_ID = 'INFURA_PROJECT_ID';
const contractAddr = "0xb683D83a532e2Cb7DFa5275eED3698436371cc9f";
const accountAddr = '0xd804ab1667e940052614a5acd103dde4d298ce36';

web3 = new Web3(new  Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`));

console.log('Calling Contract.....');

const Contract = new web3.eth.Contract(contractAbi, contractAddr);

Contract.methods.balanceOf(accountAddr).call().then(console.log);
