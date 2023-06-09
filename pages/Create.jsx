import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { inputInfo } from '../constants';
import { motion } from 'framer-motion';
import {Navbar} from '../components';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { utils } from 'ethers';
import { sc_factory_tesnet } from '../config';
import Factory from '../constants/Factory_metadata.json'; //Factory.output.abi
import Escrow from '../constants/Escrow_metadata.json';
import RealEstate from '../constants/RealEstate_metadata.json';
const {Polybase} = require('@polybase/client');
import { Auth } from '@polybase/auth'


const Create = () => {
    const router = useRouter();
    let data = router.query.data
    if (data) { data = utils.getAddress(data) }
    const [account, setAccount] = useState(data)
    const [provider, setProvider] = useState(null)
    const { handleSubmit, register } = useForm();



    async function savePolyBase(data,address_rs, address_escrow ){
        const auth = new Auth()
        let db = new Polybase({defaultNamespace: process.env.NEXT_PUBLIC_NAME_ESPACE});

        //todo: create signer in polybase
        // db.signer(async(dataSigner) => {
        //     return {
        //       h: 'eth-personal-sign',
        //       sig: await auth.ethPersonalSign(dataSigner)
        //     }
        // })
        const collectionReference = db.collection(process.env.NEXT_PUBLIC_POLYBASE_NAME);

        console.log("data", data)
        let res = await collectionReference.create([
            data.id, 
            address_rs,
            address_escrow
        ])
    }

    async function createItem(data){
        const new_data = JSON.stringify(data)

        console.log("CLAVE:", data.clave)
        if(data.clave == process.env.NEXT_PUBLIC_CREATE_CLAVE){
            const auth = 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_INFURA_ID + ':' + process.env.NEXT_PUBLIC_INFURA_SECRET_KEY).toString('base64');
            const client = create({
                host: 'ipfs.infura.io',
                port: 5001,
                protocol: 'https',
                headers: {
                    authorization: auth
                  }
            });
            try{
                const added = await client.add(new_data)
                const url = 'https://ipfs.io/ipfs/'+added.path+""
                console.log("NUEVA URL:", url)
                createinSC(data,url)
            }catch (error){
                console.error("Error uploading file:",error)
            }
        }else{
            const error = 67
            console.error("Error #%d You need the clave for create a new CPD", error)
        }
    }

    async function createinSC(data,url){
        const seller = process.env.NEXT_PUBLIC_SELLER 
        const inspector = process.env.NEXT_PUBLIC_INSPECTOR
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const signer = await provider.getSigner();
        console.log(signer)

        const Contract_factory = new ethers.Contract(sc_factory_tesnet, Factory.output.abi, provider);
        const Contract_escrow = new ethers.ContractFactory(Escrow.output.abi, Escrow.bytecode, signer);
        const Contract_real_estate = new ethers.ContractFactory(RealEstate.output.abi, RealEstate.bytecode,signer);

        
        const supply = parseInt(data.fractions)
        const price = parseInt(data.purchase_price)
        const decimals = parseInt(data.decimals)

        const antes = Number(await Contract_factory.totalRealEstate());
        console.log("antes total:",antes)
        Contract_factory.connect(signer).CreateNewRealEstate(
            supply,
            url,
            price,
            decimals
        ). then( async (result) => {
            console.log("result: ",result)
        });

        const delayInMilliseconds = 60000; //60 second

        setTimeout(async function() {
            const total_rs = Number(await Contract_factory.totalRealEstate());
            console.log("Ahora total_rs:",total_rs)
            if (total_rs == 0) {
                console.log("ERROR: The total real state is zero")
            }

            const address_rs = await Contract_factory.RealEstateArray(total_rs-1);
            console.log(`Deployed RS 1 Contract at: ${address_rs}`); 

            const escrow = await Contract_escrow.deploy(address_rs,supply,seller,inspector);
            await escrow.deployed()
            console.log(`Deployed Escrow Contract RS 1 at: ${escrow.address}\n`); 

            let real_estate = Contract_real_estate.attach(address_rs);
            console.log("real_estate",real_estate)

            for (let i = 1; i<= supply; i++){
                let transaction = await real_estate.connect(signer).mint();
                await transaction.wait();
                transaction = await real_estate.connect(signer).approve(escrow.address, i)
                await transaction.wait();
                transaction = await escrow.connect(signer).preList(i)
                await transaction.wait()
            }
            savePolyBase(data,address_rs,escrow.address)

        }, delayInMilliseconds);
    }

    const submit = (data) => {
        if (account) {
            createItem(data);
        } else{
            console.log('No account selected')
        }
        
    }

    return (
        <div>
            <Navbar/>
        
            <motion.div className='bg-discount-gradient flex flex-col justify-center items-center'
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: .1 }}>

                <h1 className='w-full flex justify-center text-6xl p-4 text-white text-center'>
                    Subiendo  . . .
                </h1>
                <p className='w-full text-2xl p-4 text-center text-neutral-400 text-gradient2'>
                    Complete los datos para subir a la pĺataforma el inmueble.
                </p>
                
                <form onSubmit={handleSubmit(submit)} className=' lg:w-[800px] md:w-[500px] sm:w-[300px]'>
                    {inputInfo.map((input) => (
                        <li key={input.id}>
                            <div
                                className='flex flex-col w-full items-center'>
                                <label
                                    htmlFor={`${input.name}`}
                                    className='w-full flex  text-white text-2xl p-4'>
                                    {input.name}
                                </label>
                                <input
                                    type="text"
                                    id={`${input.id}`}
                                    {...register(input.id)}
                                    placeholder={`${input.placeholder}`}
                                    className='w-full flex  p-5 rounded-lg bg-white' />
                            </div>
                        </li>
                    ))}
                    <button
                        className='w-[200px] mt-10 text-white text-2xl rounded-xl p-7 bg-black-gradient-2 my-4'>
                        Enviar
                    </button>
                    
                    
                </form>
            </motion.div>
        </div>
    );
};

export default Create;