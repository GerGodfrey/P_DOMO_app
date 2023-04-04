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
      <nav className={`hidden bg-transparent p-[15px] sm:flex`}>
        <ul className={`flex justify-evenly w-full items-center`}>
          <li>
            <div className={`flex font-russo text-[#E5E5E5] gap-10 text-[18px] items-center`}>
              <Link href={{ pathname: "/", query: { data: account } }} legacyBehavior>
                <Image src={logo} alt="" className='logonav' />
              </Link>
              <Link href={{ pathname: "/my-home", query: { data: account } }} legacyBehavior>
                <a className='mr-4 text-[#FFFFFF] hover:text-pink3'>
                  My Home
                </a>
              </Link>
              <p>
                Secondary Market
              </p>
              <Link href={{ pathname: "/Doubts", query: { data: account } }} legacyBehavior>
                <a className='mr-4 text-[#FFFFFF] hover:text-pink3'>
                  Instructions
                </a>
              </Link>

            </div>
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
                  <button type='button' className='nav__connect' onClick={connectHandler} >
                    Connect
                  </button>
                </div>
              )
            }
          </li>
        </ul>
      </nav>
      <nav className={`flex bg-transparent p-[15px] sm:hidden`}>
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