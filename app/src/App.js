import React, { useEffect, useState } from 'react';
import './App.css';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { render } from '@testing-library/react';



const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
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
    await getMetadata()
  };
  const getMetadata = async () =>{
    const connection = new Connection("https://api.devnet.solana.com");
    const nftsmetadata = await getAllNfts();
    var ImageAndSounds=[];
    for(let nftIndex in nftsmetadata){
    let selecetNft= nftsmetadata[nftIndex];
    const nftMint=selecetNft.mint;
    const metadataPDA = await Metadata.getPDA(new PublicKey(nftMint));
    const tokenMetadata = await Metadata.load(connection, metadataPDA);
    const uri = tokenMetadata.data.data.uri;
    const json = await fetchUri(uri);
    const image=json["image"];
    try{

      const sound = json["properties"]["files"][1]["uri"];
      if(sound != null){
        let tempArr=[image,sound];
        ImageAndSounds.push(tempArr);
      }
    }
    catch{
      continue;
    }
    
    }
    setNftMetadata(ImageAndSounds);
  }
  const fetchUri = async (uri) =>{
    return fetch(uri).then(res => res.json())
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

function renderText(){
  if(walletAddress != null){
  return( 
    
    <div>
    <h1 >by Neden Sinir#9150</h1>
  <h4>connected with: {walletAddress}</h4>
  <h5>wait after clicking get metadata fetching nfts may take time</h5>
  <h1 >album photo/music play</h1>
  </div>
  )
}
}
function renderSoundRows() {
  const products =getNftMetadata;

  const list = []

  products.forEach((product) => {
    list.push(<li>
      <img src = {product[0]}></img>
      <audio controls src = {product[1]} ></audio>
    </li>)
  })

  return (
    <div>
      {list}
    </div>
  )
}

  
    return (
      <div className="connected-container">
        <button
  className="cta-button connect-wallet-button"
  onClick={connectWallet}
  >
  Connect to Wallet
  </button>
  <button className="cta-button submit-gif-button" onClick={getMetadata}>
          refresh metadata
        </button> 
        <div className="">
        {renderText()}
        {renderSoundRows()}
      </div>
      </div>
    )
  
};

export default App;
