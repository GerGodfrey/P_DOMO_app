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
import {Navbar, Search} from '../components'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [homes, setHomes] = useState([])

  const loadBlockchainData = async () => {
    // const provider = new ethers.providers.JsonRpcProvider()
    // const realStateContract = new ethers.Contract(sc_realState,RealEstate.abi,provider)
    // const escrowContract = new ethers.Contract(sc_scrow,Escrow.abi,provider)
    // console.log(realStateContract)
    // console.log(escrowContract)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const network = await provider.getNetwork()
    const factory = new ethers.Contract(sc_factory_localhost, Factory.abi, provider)
    const total_rs = Number(await factory.totalRealEstate())
    const homes = []

    for( var i = 0 ; i< total_rs; i++){
      const address_re = await factory.RealEstateArray(i);
      const realEstate = new ethers.Contract(address_re, RealEstate.abi, provider);
      const totalSupply = Number(await realEstate.totalSupply())
      const maxSupply = Number(await realEstate.maxSupply())
      const data = await realEstate.tokenDATA();
      const response = await fetch(data)
      var metadata = await response.json()
      metadata["percentage"] = totalSupply * 100 / maxSupply
      homes.push(metadata)
    }
    setHomes(homes)
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

  return (
    <div>
      <Navbar account={account} setAccount={setAccount} / >
      <Search />

      <div className='cards__section'>
        <h1> Home </h1>
        <hr />
        <div className = 'cards'>

          {homes.map((home,index) => (
            <div className='card' key={index}>
              <div className='card__image'>
                <img src={home.image} alt='Home'/>
              </div>
              <div className='card__info'>
                <h4> {home.attributes[0].value} ETH </h4>
                <p>
                  <strong> {home.attributes[2].value} </strong> bds \ 
                  <strong> {home.attributes[3].value} </strong> ba \
                  <strong> {home.attributes[4].value} </strong> sqft \
                </p>
                <p> {home.address}</p>
                <p> {home.percentage}</p>
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}
