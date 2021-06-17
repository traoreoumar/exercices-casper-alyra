import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, valueInForm: 0, web3: null, accounts: null, contract: null };

  constructor(props) {
    super(props);

    this.listenStoredDataUpdatedContractEvent = this.listenStoredDataUpdatedContractEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const storageValue = await instance.methods.get().call({ from: accounts[0] });

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, storageValue, valueInForm: storageValue }/*, this.runExample*/);

      this.listenStoredDataUpdatedContractEvent();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  listenStoredDataUpdatedContractEvent = () => {
    this.state.contract.events.StoredDataUpdated()
      .on('data', (event) => {
        console.log(event);

        // Update state with the result.
        this.setState({ storageValue: event.returnValues.storedData });
      })
      .on('changed', (event) => {
          // remove event from local database
      })
      .on('error', console.error)
    ;
  }

  handleChange(event) {
    this.setState({valueInForm: event.target.value});
  }

  async submitForm(event) {
    event.preventDefault();

    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(this.state.valueInForm).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // Update state with the result.
    // this.setState({ storageValue: response });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <form onSubmit={this.submitForm}>
          <label htmlFor="field_new_value">New Value :</label>
          <input id="field_new_value" type="number" min="0" value={this.state.valueInForm} onChange={this.handleChange.bind(this)} />

          <button>Set</button>
        </form>
      </div>
    );
  }
}

export default App;
