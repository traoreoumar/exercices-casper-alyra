// Import du smart contract "SimpleStorage"
const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = (deployer) => {
  // Deployer le smart contract!
  deployer.deploy(SimpleStorage);
}