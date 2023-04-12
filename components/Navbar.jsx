// import React from 'react'
import Link from 'next/link';
// import Router from 'next/link'
import logo from '../assets/logo.svg';
// import { navLinks } from '../constants';
import Image from 'next/image'
// import { Button } from 'react-scroll';
import metamask from '../assets/metamask.svg';
import { ethers } from 'ethers';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../lib/context.js';
import menu2 from '../assets/menu2.svg';
import metamask2 from '../assets/metamask2.svg';


const Navbar = () => {

  const [account, setAccount] = useContext(UserContext);
  const [toggle, setToggle] = useState(false);

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);

    // const prov = new ethers.providers.Web3Provider(window.ethereum)
    // setProvider(prov);
  }

  return (
    <div>
      <nav className={`hidden bg-transparent mt-[42px] sm:flex`}>
        <ul className='flex justify-around w-full items-center'>
          <li>
            <Link href={{ pathname: "/", query: { data: account } }} legacyBehavior>
              <Image src={logo} alt="" className='logonav' />
            </Link>
          </li>
          <li>
            <div className='flex justify-between gap-[30px]'>
              <Link href={{ pathname: "/my-home", query: { data: account } }} legacyBehavior>
                <a className='navmenu hover:text-[#EE2A7B]'>
                  My Home
                </a>
              </Link>
              <p className='navmenu'>
                Secondary Market
              </p>
              <Link href={{ pathname: "/Doubts", query: { data: account } }} legacyBehavior>
                <a className='navmenu hover:text-[#EE2A7B]'>
                  Instructions
                </a>
              </Link>

            </div>
          </li>
          <li>
            {
              account ? (
                <div className='navwalletS flex items-center justify-center gap-[8px]'>
                  <Image src={metamask2} alt='metamask' className='w-[15%]' />
                  <button type='button' className='nav__connect' style={{color:'#1FE72E'}}>
                    {account.slice(0, 6) + '...' + account.slice(38, 42)}
                  </button>
                </div>
              ) : (
                <div className='navwallet flex items-center justify-center gap-[8px] hover:bg-[#EE2A7B] hover:border-[#EE2A7B] hover:cursor-pointer' onClick={connectHandler}>
                  <Image src={metamask} alt='metamask' className='w-[15%]' />
                  <button type='button' className='nav__connect'>
                    Connect
                  </button>
                </div>
              )
            }
          </li>
        </ul>
      </nav>
      <nav className={`flex bg-transparent sm:hidden`}>
        <ul className={`flex justify-evenly w-full items-center`}>
          <li>
            <Link href={{ pathname: "/", query: { data: account } }} legacyBehavior>
              <Image src={logo} alt="" className='logonav' />
            </Link>
          </li>
          <li>
            <Image src={menu2} alt='menu' />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar; 