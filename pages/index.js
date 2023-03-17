import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { sc_realState, sc_scrow } from '../config'
import Escrow from '../artifacts/contracts/Escrow.sol/Escrow.json'
import RealEstate from '../artifacts/contracts/RealEstate.sol/RealEstate.json'
import Navbar from '../components/Navbar'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [account, setAccount] = useState(null)


  const loadBlockchainData = async () => {
    // const provider = new ethers.providers.JsonRpcProvider()
    // const realStateContract = new ethers.Contract(sc_realState,RealEstate.abi,provider)
    // const escrowContract = new ethers.Contract(sc_scrow,Escrow.abi,provider)
    // console.log(realStateContract)
    // console.log(escrowContract)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    window.ethereum.on('accountsChanged', async() => {
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
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
      <h1> Home </h1>
    </div>
  )
}
