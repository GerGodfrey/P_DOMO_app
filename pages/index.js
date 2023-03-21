
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { sc_factory_localhost, sc_realState_localhost, sc_scrow_localhost } from '../config'
import Escrow from '../artifacts/contracts/Escrow.sol/Escrow.json'
import Factory from '../artifacts/contracts/RealEstate.sol/Factory.json'
import RealEstate from '../artifacts/contracts/RealEstate.sol/RealEstate.json'
import {Navbar, Search, PopHome} from '../components'
import { Polybase } from '@polybase/client'
import { ethPersonalSign } from '@polybase/eth'
import * as eth from "@polybase/eth"
const path = require('path');
require('dotenv').config({ path: path.resolve('config.env'),});
const NEXT_PUBLIC_NAME_ESPACE  = process.env.NEXT_PUBLIC_NAME_ESPACE;
const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [homes, setHomes] = useState([])
  const [home, setHome] = useState([])
  const [toggle, setToggle] = useState(false)
  const [escrow, setEscrow] = useState(null)
  

  const loadBlockchainData = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    //const network = await provider.getNetwork()
    const factory = new ethers.Contract(sc_factory_localhost, Factory.abi, provider)
    const total_rs = Number(await factory.totalRealEstate())
    const homes = []

    for( var i = 0 ; i< total_rs; i++){
      const address_re = await factory.RealEstateArray(i);
      const realEstate = new ethers.Contract(address_re, RealEstate.abi, provider);
      const totalSupply = Number(await realEstate.totalSupply());
      const maxSupply = Number(await realEstate.maxSupply());
      const data = await realEstate.tokenDATA();
      const response = await fetch(data);
      var metadata = await response.json();
      metadata["address_re"] = address_re;
      metadata["percentage"] = totalSupply * 100 / maxSupply;
      homes.push(metadata);
    }
    setHomes(homes)
  }


  async function connectDB(address_re){

    let db = new Polybase({
      defaultNamespace: NEXT_PUBLIC_NAME_ESPACE,
    });

    const collectionReference = db.collection("Contracts5");
    const records = await collectionReference.where("real_estate_contract", "==", address_re).get();
    const escrow_contract = records.data[0].data.escrow_contract

    return escrow_contract;

  }

  async function connect() { 
    const web3modal = new Web3Modal()
    const connection = await web3modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
  }

  useEffect ( () => {
    loadBlockchainData()
  }, [])

  const togglePop = (home) => {

    const escrow_contract = connectDB(home.address_re);
    const escrow = new ethers.Contract(escrow_contract,Escrow.abi, provider)
    setEscrow(escrow)

    setHome(home)
    toggle ? setToggle(false) : setToggle(true)
  }

  return (
    <div>
      <Navbar account={account} setAccount={setAccount} / >
      <Search />

      <div className='cards__section'>
        <h1> Home </h1>
        <hr />
        <div className = 'cards'>
          {homes.map((home,index) => (
            <div className='card' key={index} onClick={() => togglePop(home)}> 
              <div className='card__image'>
                <img src={home.image} alt='Home'/>
              </div>
              <div className='card__info'>
                <h4> {home.name} </h4>
                <p> {home.address}</p>
                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                  <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${home.percentage}%`}}>
                    {home.percentage}%
                  </div>
                </div>             
              </div>
            </div>
          ))}
        </div>
      </div>

      {toggle && (
        <PopHome home={home} provider={provider} account={account} escrow={escrow} 
          togglePop={togglePop} />
      )}

    </div>
  );
}
