import { useEffect, useState } from 'react';
import { UserContext } from '../lib/context.js';
import Layout from '../components/layout';
import '../styles/globals.css';
import '../index.css';
import React from 'react';
import { ethers } from 'ethers';

function App({ Component, pageProps }) {
  const [account, setAccount] = useState()
  const [toggle, setToggle] = useState(false);
  // const [provider, setProvider] = useState(null)
  
  // const connectHandler = async () => {
  //   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //   setAccount(accounts[0]);
  //   console.log("ACCOUNT_NAVBAR:", accounts)
  //   loadBlockchainData()
  // }

  // const loadBlockchainData = async () => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum)
  //   setProvider(provider)
  //   console.log("PROVIDER_NAVBAR:", provider)
  // }

  // useEffect ( () => {
  //   //connectHandler()
  // }, [])

  return (
      <UserContext.Provider value={[account, setAccount]}>
        <Layout>
          <Component {...pageProps}  />
        </Layout>
      </UserContext.Provider>
  )
}


export default App