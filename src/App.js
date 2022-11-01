import { useEffect, useState } from "react";
import "./App.css";
import contractabi from "./contracts/erc721A.json";
import { ethers } from "ethers";

// goerli
const contractAddress = "0x71eE06999F6D5f66AcA3c12e45656362fD9D031f";
const abi = contractabi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const checkWalletIsConnected = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
    } else {
      console.log("Wallet exists! let's go!");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install Metamask!");
    }
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0];
      console.log(accounts);
      setCurrentAccount(account);
    } catch (error) {
      console.log(error);
    }
  };

  const mintNftHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("ethereum object does not exist!");
    }
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftcontract = new ethers.Contract(contractAddress, abi, signer);
      let tx = await nftcontract.mint(1);
      console.log("Minting..please await");
      console.log(`Please See: https://goerli.etherscan.io/tx/${tx.hash}`);
      await tx.wait();
      console.log("Success Minted!");
    } catch (error) {
      console.log(error);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className="cta-button mint-nft-button">
        Mint NFT
      </button>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="main-app">
      <h1>Scrappy Squirrels Tutorial</h1>
      <div>{currentAccount ? mintNftButton() : connectWalletButton()}</div>
    </div>
  );
}

export default App;
