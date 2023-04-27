import { useEffect, useState } from 'react';
import { UserContext } from '../context/context.js';
import Layout from '../components/layout';
import '../styles/globals.css';
import '../index.css';
import React from 'react';
import { ethers } from 'ethers';

function App({ Component, pageProps }) {
  const [account, setAccount] = useState()
  const [toggle, setToggle] = useState(false);
  return (
      <UserContext.Provider value={[account, setAccount]}>
        <Layout>
          <Component {...pageProps}  />
        </Layout>
      </UserContext.Provider>
  )
}


export default App