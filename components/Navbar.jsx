import React from 'react'
import Link from 'next/link'
import logo from '../assets/logo.svg'
import { useState } from 'react';
import { navLinks } from '../constants';
import Image from 'next/image'
import { Button } from 'react-scroll';
import metamask from '../assets/metamask.svg';

// import { Link, animateScroll as scroll } from "react-scroll";

const Navbar = ({ account, setAccount }) => {


  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
  }

  return (
    <div>
      <nav className={`flex bg-[#1E2022] p-[15px]`}>
        <ul className={`flex justify-evenly w-full items-center`}>
          <li>
            <div className={`flex font-russo text-[#E5E5E5] gap-10 text-[18px]`}>
              <p>
                Home
              </p>
              <p>
                My Home
              </p>
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
      {/*  <nav className='w-full flex py-6 justify-between items-center navbar'>

        <div className='flex mt-6'>
          <Link href='/' legacyBehavior>
            <a className='mr-4 text-pink2'>
              Home
            </a>
          </Link>

          <Link href='/my-home' legacyBehavior>
            <a className='mr-4 text-pink2'>
              My Home
            </a>
          </Link>

          <Link href='/mercado-secundario' legacyBehavior>
            <a className='mr-4 text-pink2'>
              Mercado Secundario
            </a>
          </Link>

          <div className='nav__brand'>

          </div>

          {
            account ? (
              <button type='button' className='nav__connect'>
                {account.slice(0, 6) + '...' + account.slice(38, 42)}
              </button>
            ) : (
              <button type='button' className='nav__connect' onClick={connectHandler}>
                Connect
              </button>
            )
          }
        </div>
      </nav>*/}
    </div>
  );
}

export default Navbar; 