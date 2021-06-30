const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    // private: {
    //  host: "37.187.54.214",
    //  port: 9245,
    //  network_id: "*",
    // },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    }
  },
};
