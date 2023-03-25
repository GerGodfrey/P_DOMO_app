import '../styles/globals.css'
import '../index.css'
import React from 'react'
import Link from 'next/link'
import Router from 'next/link'
import logo from '../assets/logo.svg'
import { useEffect, useState } from 'react'
import { navLinks } from '../constants';
import Image from 'next/image'
import { Button } from 'react-scroll';
import metamask from '../assets/metamask.svg';
import { ethers } from 'ethers';

function App({ Component, pageProps }) {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    console.log("ACCOUNT_NAVBAR:", accounts)
    loadBlockchainData()
  }

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    console.log("PROVIDER_NAVBAR:", provider)
  }

  useEffect ( () => {
    connectHandler()
  }, [])

  return (
    <div>
      <div>
        <nav className={`flex bg-[#1E2022] p-[15px]`}>
          <ul className={`flex justify-evenly w-full items-center`}>
            <li>
              <div className={`flex font-russo text-[#E5E5E5] gap-10 text-[18px]`}>
                <Link href={{pathname: "/", query: { data: account, data2 : provider }}} legacyBehavior>
                  <a className='mr-4 text-pink2 hover:text-pink3'>
                    Home
                  </a>
                </Link>

                <Link href={{pathname: "/my-home", query: { data: account, data2 : provider }}} legacyBehavior>
                  <a className='mr-4 text-pink2 hover:text-pink3'>
                    My Home
                  </a>
                </Link>
                <p>
                  Secondary Market
                </p>
              </div>
            </li>
            <li>
              <Image src={logo} alt="" className='logonav' />
            </li>
            <li>
              {
                account ? (
                  <div className='flex border-solid border-[#F7559A] border-[1px] p-3 rounded-lg'>
                    <Image src={metamask} alt='metamask' className='w-[15%]' />
                    <button type='button' className='nav__connect'>
                      {account.slice(0, 6) + '...' + account.slice(38, 42)}
                    </button>
                  </div>
                ) : (
                  <div className='flex border-solid border-[#F7559A] border-[1px] p-3 rounded-lg'>
                    <Image src={metamask} alt='metamask' className='w-[15%]' />
                    <button type='button' className='nav__connect' onClick={connectHandler}>
                      Connect
                    </button>
                  </div>
                )
              }
            </li>
          </ul>
        </nav>
      </div>
      <Component {...pageProps}  />
    </div> 
  )
}


export default App