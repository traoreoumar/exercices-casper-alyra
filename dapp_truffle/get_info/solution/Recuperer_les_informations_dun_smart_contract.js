var  Web3  =  require('web3');
web3  =  new  Web3(new  Web3.providers.HttpProvider('https://mainnet.infura.io/v3/461e417d912441f78958e476ebc11f47'));
    
console.log('Contract-ing Ebola.....');
    
var  abi  = [{"constant":true,"inputs":[],"name":"getEbola","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tipCreator","outputs":[{"name":"","type":"string"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];
var  addr  =  "0xe16f391e860420e65c659111c9e1601c0f8e2818";
var  EbolaContract  =  new  web3.eth.Contract(abi, addr);
    
// FUNCTION can be "getEbola", "getInfo", "tipCreator" and "kill"
EbolaContract.methods.FUNCTION().call().then(console.log);