import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import { Polybase } from '@polybase/client'
const path = require('path');
require('dotenv').config({ path: path.resolve('config.env'),});
const NEXT_PUBLIC_NAME_ESPACE  = process.env.NEXT_PUBLIC_NAME_ESPACE;
import { useRouter } from 'next/router';
import RealEstate from '../artifacts/contracts/RealEstate.sol/RealEstate.json'
import {utils} from 'ethers';

export default function My_home (){
    const router = useRouter();
    let data = router.query.data
    if(data){
        data = utils.getAddress(data)
      }
    const [account, setAccount] = useState(data)
    const [provider, setProvider] = useState(null)
    const [balance, setBalance] = useState(0)
    const [homes, setHomes] = useState([])

    const obtainProvider = async () => { 
        
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)
    }
    const changeWallet = async () => {
        window.ethereum.on('accountsChanged', async () => {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const acco = ethers.utils.getAddress(accounts[0])
          setAccount(acco);
          obtainProvider()
        })
    }

    const walletCredits = async (_balance, _price) => {
        let new_balance = balance + (_balance * _price ) ;
        setBalance(new_balance)
    }

    const loadBlockchainData = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)

        let db = new Polybase({
            defaultNamespace: NEXT_PUBLIC_NAME_ESPACE,
          });
          const collectionReference = db.collection("Contracts106");
          const records = await collectionReference.where("real_estate_contract").get();          
          const len = records.data.length

          if (account){
              setHomes([])
              console.log("Casas Vacias:",homes)
              for(var i=0 ; i< len ; i++){
                const address_re = records.data[i].data.real_estate_contract
                const realEstate = new ethers.Contract(address_re, RealEstate.abi, provider);
                const newBalance = Number (await realEstate.balanceOf(account));
                console.log("balance:",newBalance)
                if(newBalance !== 0){
                    const price = Number(await realEstate.publicPrice());
                    walletCredits(newBalance,price); 
                    const data = await realEstate.tokenDATA();
                    const response = await fetch(data);
                    var metadata = await response.json();
                    homes.push(metadata); 
                }
            }
            setHomes(homes);
          }
    }


    useEffect ( () => {
        loadBlockchainData(),
        changeWallet()
        
    }, [])

    const chat = () => {
        console.log("CHAdTTTT")
    }

    return (
        <div>
            
            {(account) ? (
                <div>
                    <p className="flex text-white"> Hola {account.slice(0, 6) + '...' + account.slice(38, 42)} el valor de tu hogar es {balance} ETH</p>
                    <div className = 'cards'>
                        {homes.map((home,index) => (
                            <div className='card' key={index} onClick={() => chat()}> 
                            <div className='card__image relative'>
                                <img src={home.image} alt='Home' className=' rounded-[30px]'/>
                                <div className='info'>
                                <h4> {home.name} </h4>
                                <p> {home.address}</p>
                                </div>
                            </div>
                            <div className='info2 mt-[1rem]'>
                                <h4 className='card__info'> {home.name} </h4>
                                <p className='card__info'> {home.address}</p>
                            </div>
                            </div>
                        ))}
                    </div>
                </div>
                

            ) : (
                <p className="flex text-white"> CONECTA TU WALLET </p>
            )}
            
        </div>
    )
}