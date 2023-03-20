import React from 'react'
import Link from 'next/link'
import { logo_color, close, menu } from '../assets';
import { useState } from 'react';
import { navLinks } from '../constants';
import Image from 'next/image'
import { Button } from 'react-scroll';

// import { Link, animateScroll as scroll } from "react-scroll";

const Navbar = ({account,setAccount}) => {


  const connectHandler = async () => {
    const accounts = await window.ethereum.request({method :'eth_requestAccounts'});
    setAccount(accounts[0]);
  }

  return (
    <div>
      <nav className='w-full flex py-6 justify-between items-center navbar'>
        
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
            <img src='{logo_color}' alt="Logo" />
          </div>

          {
          account ? (
            <button type='button' className='nav__connect'>
              {account.slice(0,6) + '...' + account.slice(38,42)}
            </button>
          ) : (
            <button type = 'button' className='nav__connect' onClick={connectHandler}>
              Connect 
            </button>
          )
        }
        </div>
      </nav>
    </div>
  );
}

export default Navbar; 