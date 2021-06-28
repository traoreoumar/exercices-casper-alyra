const path = require("path");

require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const MNEMONIC_PHRASE = process.env.MNEMONIC_PHRASE;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    rinkeby: {
      provider: () => new HDWalletProvider(MNEMONIC_PHRASE, `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`),
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.6.11",
    }
  }
};
