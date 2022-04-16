import React, { useEffect, useState } from 'react';
import './App.css';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import idl from './idl.json';
import kp from './keypair.json'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';


// Constants

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}




const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("0");
  const [getNftMetadata, setNftMetadata] = useState([]);


  const checkIfWalletIsConnected = async () => {
    console.log("asdasdasdasd")
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
  
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
    
  };
  
  
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }
  const getNum = async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      
      console.log("Got the account", account)

    } catch (error) {
      console.log("Error in getGifList: ", error)
      setInputValue(0);
    }
  }
  
 const CreateBaseAccount= async() =>{
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping")
    await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    });
    await getNum()

  } catch(error) {
    console.log("Error creating BaseAccount account:", error)
  }
 }

 const IncreaseNum= async() =>{
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("increse")
    await program.rpc.increse({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    setInputValue(account.num.toNumber())
  } catch(error) {
    console.log("Error incresing num :", error)
  }
 }
 const getAllNfts = async () =>{
  const connection = new Connection("https://api.devnet.solana.com");
  const ownerPublickey = walletAddress;
  return await Metadata.findDataByOwner(connection, ownerPublickey)

 }

 useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
}, []);



    return (
      <div className="connected-container">
        <button
  className="cta-button connect-wallet-button"
  onClick={connectWallet}
  >
  Connect to Wallet
  </button>
        <button className="cta-button submit-gif-button" onClick={CreateBaseAccount}>
          Do One-Time Initialization For GIF Program Account
        </button>
        <button className="cta-button submit-gif-button" onClick={getNum}>
          get number
        </button>
        <button className="cta-button submit-gif-button" onClick={IncreaseNum}>
          increse number
        </button>

        <div className="">
        <h1>{inputValue}</h1>
      </div>
      </div>
    )
  
};

export default App;