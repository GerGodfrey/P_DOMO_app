import React from 'react'
import Link from 'next/link'
import { logo_color, close, menu } from '../assets';
import { useState } from 'react';
import { navLinks } from '../constants';

// import { Link, animateScroll as scroll } from "react-scroll";

const Navbar = () => {
  return (
    <div>
      <nav className='w-full flex py-6 justify-between items-center navbar'>
        <p> DOMO APP </p>
        <div className='flex mt-4'>
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
        </div>
      </nav>
    </div>
  );
}

export default Navbar; 