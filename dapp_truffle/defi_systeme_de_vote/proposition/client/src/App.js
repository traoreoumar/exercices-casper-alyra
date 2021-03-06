import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import { Container } from "react-bootstrap";

import "./App.scss";

import Voting from "./modules/Voting/components/Voting/Voting";
import { Web3Context } from "./contexts/web3-context";

class App extends Component {
  state = { web3: null, accounts: [] };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
          this.setState({ accounts });
        });

        window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
      }

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <Container>
        <h1 className="text-center">Vote</h1>
        <Web3Context.Provider value={{ web3: this.state.web3, accounts: this.state.accounts }}>
          <Voting></Voting>
        </Web3Context.Provider>
      </Container>
    );
  }
}

export default App;
