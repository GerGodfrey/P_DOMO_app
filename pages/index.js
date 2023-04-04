// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from '@next/font/google'
// import styles from '@/styles/Home.module.css'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
// import axios from 'axios'
// import Web3Modal from 'web3modal'
import { sc_factory_localhost, sc_factory_tesnet } from '../config'
// import Escrow from '../artifacts/contracts/Escrow.sol/Escrow.json'
// import Factory from '../artifacts/contracts/RealEstate.sol/Factory.json'
// import RealEstate from '../artifacts/contracts/RealEstate.sol/RealEstate.json'
import Escrow from '../constants/Escrow_metadata.json'
import Factory from '../constants/Factory_metadata.json'
import RealEstate from '../constants/RealEstate_metadata.json'
import { Search, PopHome, Navbar } from '../components'
import { Polybase } from '@polybase/client'
import { useRouter } from 'next/router';
import { utils } from 'ethers';
import search from '../assets/search.jpeg';

const path = require('path');
require('dotenv').config({ path: path.resolve('config.env'), });
const NEXT_PUBLIC_NAME_ESPACE = process.env.NEXT_PUBLIC_NAME_ESPACE;

export default function Home() {
  const router = useRouter();
  let data = router.query.data
  if (data) {
    data = utils.getAddress(data)
  }
  const [account, setAccount] = useState(data)

  console.log("ACCOUNT_INDEX:", account)

  const [provider, setProvider] = useState(null)
  const [homes, setHomes] = useState([])
  const [home, setHome] = useState([])
  const [toggle, setToggle] = useState(false)
  const [escrow, setEscrow] = useState(null)
  const [realEstate, setRealEstate] = useState(null)


  const loadBlockchainData = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    //const network = await provider.getNetwork()
    const factory = new ethers.Contract(sc_factory_tesnet, Factory.output.abi, provider)
    const total_rs = Number(await factory.totalRealEstate())
    const homes = []

    for (var i = 0; i < total_rs; i++) {
      const address_re = await factory.RealEstateArray(i);
      const realEstate = new ethers.Contract(address_re, RealEstate.output.abi, provider);

      const totalSupply = Number(await realEstate.totalSupply());
      const maxSupply = Number(await realEstate.maxSupply());
      // const precio = Number(await realEstate.publicPrice());
      const data = await realEstate.tokenDATA();
      const response = await fetch(data);
      var metadata = await response.json();
      metadata["address_re"] = address_re;
      metadata["totalSupply"] = totalSupply;
      metadata["maxSupply"] = maxSupply;
      metadata["percentage"] = totalSupply * 100 / maxSupply;

      homes.push(metadata);
    }
    setHomes(homes)
  }

  const changeWallet = async () => {
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account);
    })
  }

  async function connectDB(address_re) {
    let db = new Polybase({
      defaultNamespace: "pk/0x7fd09c2b6e44027ed2b6e478a5ff36e201317a6d4734e3ae4868827740ecf53265bff10a510904fc12fd98e277fb8af107f463425346ae359b19f25754bbf9fb/DOMO",
    });
    const collectionReference = db.collection("Tesnet01");
    const records = await collectionReference.where("real_estate_contract", "==", address_re).get();
    const escrow_contract = records.data[0].data.escrow_contract
    return escrow_contract;
  }

  useEffect(() => {
    loadBlockchainData(),
      changeWallet()
  }, [])

  const togglePop = (home) => {
    setHome(home);
    const escrow_contract = connectDB(home.address_re);
    const escrow = new ethers.Contract(escrow_contract, Escrow.output.abi, provider);
    setEscrow(escrow);

    if (!toggle && account) {
      const realEstate = new ethers.Contract(home.address_re, RealEstate.output.abi, provider);
      setRealEstate(realEstate);
    }

    toggle ? setToggle(false) : setToggle(true)
  }

  return (
    <div>
      <div style={{ backgroundImage:`url(${search.src})`, backgroundPosition:'center', backgroundSize:'cover'}}>
        <Navbar />
        <Search />
      </div>
      <div className='cards__section card1 pb-[5rem]'>
        <h1 className='text-[#FFFFFF] p-10 font-russo text-[40px] text-center'> Some Opportunities: </h1>
        <div className='cards'>
          {homes.map((home, index) => (
            <div className='card' key={index} onClick={() => togglePop(home)}>
              <div className='card__image relative'>
                <img src={home.image} alt='Home' className=' rounded-[30px]' />
                <div className='info'>
                  <h4> {home.name} </h4>
                  <p> {home.address}</p>
                </div>
              </div>

              <div className='info2 mt-[1rem]'>
                <h4 className='card__info'> {home.name} </h4>
                <p className='card__info'> {home.address}</p>
              </div>

              <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mt-[2rem]">
                <div className="bg-[#F7559A] text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${home.percentage}%` }}>
                  {home.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toggle && (
        <PopHome home={home} provider={provider} account={account} escrow={escrow} real
          realEstate={realEstate} togglePop={togglePop} />
      )}
    </div>
  );
}
