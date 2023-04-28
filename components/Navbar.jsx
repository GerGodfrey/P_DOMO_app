import Link from 'next/link';
import logo from '../assets/logo.svg';
import Image from 'next/image'
import metamask from '../assets/metamask.svg';
import { ethers } from 'ethers';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/context.js';
import menu2 from '../assets/menu2.svg';
import metamask2 from '../assets/metamask2.svg';
//import { magic } from '../lib/magic.js';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [account, setAccount] = useContext(UserContext);

  const connectHandler = async () => {

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //MAGIC LINK 
    //const accounts = await magic.wallet.connectWithUI();
    //console.log("account:",accounts[0])
    setAccount(accounts[0]);
  }

  //todo: create onClick={logout} in button handler
  // const logout = async () => {
  //   console.log("Logged out");
  //   await magic.wallet.disconnect();
  //   setAccount();
  // }

  return (
    <div>
      <nav className='hidden bg-transparent mt-[42px] sm:flex'>
        <ul className='flex justify-around w-full items-center'>
          <li>
            <Link href={{ pathname: "/", query: { data: account } }} legacyBehavior>
              <Image src={logo} alt="Logo DOMO" className=' hover:cursor-pointer  sm:w-[80%]' />
            </Link>
          </li>
          <li>
            <div className='flex justify-between gap-[10px] md:gap-[30px]'>
              <Link href={{ pathname: "/my-home", query: { data: account } }} legacyBehavior>
                <a className='textmenu hover:text-pink1'>
                  My
                </a>
              </Link>
              <Link href={{ pathname: "/Doubts", query: { data: account } }} legacyBehavior>
                <a className='textmenu hover:text-pink1'>
                  Instructions
                </a>
              </Link>
              <Link href={{ pathname: "Create", query: { data: account } }} legacyBehavior>
                <a className='textmenu hover:text-pink1'>
                  Create
                </a>
              </Link>
              {/* <Link href={{ pathname: "Home", query: { data: account } }} legacyBehavior>
                <a className='textmenu hover:text-pink1'>
                  Config
                </a>
              </Link> */}
            </div>
          </li>
          <li>
            {
              account ? (
                <div className='walletSucces flex items-center justify-center gap-[8px] textWallet md:w-[223px] md:h-[65px] md:text-[18px]'>
                  <Image src={metamask2} alt='metamask' className='w-[10%] md:w-[15%]' />
                  <button type='button' style={{ color: '#1FE72E' }} > 
                    {account.slice(0, 6) + '...' + account.slice(38, 42)}
                  </button>
                </div>
              ) : (
                <div className='walletConnect flex items-center justify-center gap-[8px] hoverWallet textWallet md:w-[223px] md:h-[65px] md:text-[18px]' onClick={connectHandler}>
                  <Image src={metamask} alt='metamask' className='w-[15%]' />
                  <button type='button'>
                    Connect
                  </button>
                </div>
              )
            }
          </li>
        </ul>
      </nav>
      <nav className={`flex bg-transparent sm:hidden mt-[30px]`}>
        <ul className={`flex justify-evenly w-full items-center`}>
          <li>
            <Link href={{ pathname: "/", query: { data: account } }} legacyBehavior>
              <Image src={logo} alt="" className='logonav' />
            </Link>
          </li>
          <li onClick={() => setToggle(!toggle)}>
            <Image src={menu2} alt='menu' />
          </li>
        </ul>
        {toggle && (
          <ul className='absolute top-[85px] left-0 h-[100vh] bg-background w-full z-[10] flex flex-col justify-evenly'>
            <li>
              <div className='flex flex-col h-[30vh] items-center justify-between'>
                <Link href={{ pathname: "/my-home", query: { data: account } }} legacyBehavior>
                  <a className='textmenu hover:text-pink1'>
                    My Home
                  </a>
                </Link>
                <p className='textmenu'>
                  Secondary Market
                </p>
                <Link href={{ pathname: "/Doubts", query: { data: account } }} legacyBehavior>
                  <a className='textmenu hover:text-pink1'>
                    Instructions
                  </a>
                </Link>
              </div>
            </li>
            <li className=' flex justify-center'>
              {
                account ? (
                  <div className='walletSucces flex items-center justify-center gap-[8px] textWallet md:w-[223px] md:h-[65px] md:text-[18px]'>
                    <Image src={metamask2} alt='metamask' className='w-[10%] md:w-[15%]' />
                    <button type='button' style={{ color: '#1FE72E' }} >
                      {account.slice(0, 6) + '...' + account.slice(38, 42)}
                    </button>
                  </div>
                ) : (
                  <div className='walletConnect flex items-center justify-center gap-[8px] hoverWallet textWallet md:w-[223px] md:h-[65px] md:text-[18px]' onClick={connectHandler}>
                    <Image src={metamask} alt='metamask' className='w-[15%]' />
                    <button type='button'>
                      Connect
                    </button>
                  </div>
                )
              }
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}

export default Navbar; 