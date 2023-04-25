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


const Create = () => {
    const router = useRouter();
    let data = router.query.data
    if (data) { data = utils.getAddress(data) }
    const [account, setAccount] = useState(data)
    const [provider, setProvider] = useState(null)


    //const [fileUrl, setFileUrl] = useState(null);
    const { handleSubmit, register } = useForm();



    async function createItem(data){
        console.log('Creating')
        const auth = 'Basic ' + Buffer.from("2OhsFmhCv72vOMT2Lr2pnJZBGnf" + ':' + "8d1c6baacb1ee0ca248ca7e151a9a8d2").toString('base64');
        const client = create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
                authorization: auth
              }
        });
        try{
            
            //const new_data = JSON.stringify(data)
            //const added = await client.add(new_data)
            //const url = 'https://ipfs.io/ipfs/'+added.path+""
            console.log("NUEVA URL:", "https://ipfs.io/ipfs/QmbGPwR7tfLxLPXg6DEq9H6HqjiS5sixGyo4NnvFpcvmKr")
            //https://ipfs.io/ipfs/QmPxaRBAM4Zu4kcq65xs4LmcVASkFyLLYozLqE2VcY83FC 10 cachos 
            // https://ipfs.io/ipfs/QmbGPwR7tfLxLPXg6DEq9H6HqjiS5sixGyo4NnvFpcvmKr 3 cachos 
            createinSC(data,"https://ipfs.io/ipfs/QmbGPwR7tfLxLPXg6DEq9H6HqjiS5sixGyo4NnvFpcvmKr")
        }catch (error){
            console.log("Error uploading file:",error)
        }
    }

    async function createinSC(data,url){
        const seller = "0xF7E81CDD73c3C5309a9a346E365BdDC21CF67Df1"
        const inspector = "0x5281007dD0E66984A6E68e11039Fda8f038B5195"
        
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

        const delayInMilliseconds = 60000; //30 second

        setTimeout(async function() {
            const total_rs = Number(await Contract_factory.totalRealEstate());
            console.log("Ahora total_rs:",total_rs)
            if (total_rs == 0) {
                console.log("ERROR: The total real state is zero")
            }

            const address_rs = await Contract_factory.RealEstateArray(total_rs-1);
            console.log(`Deployed RS 1 Contract at: ${address_rs}`); // 0xff5Bc2D5c3b147692C7FAAFa13A5327D2A373D6e

            const escrow = await Contract_escrow.deploy(address_rs,supply,seller,inspector);
            await escrow.deployed()
            console.log(`Deployed Escrow Contract RS 1 at: ${escrow.address}\n`); //0x66eb0b5595cAfD6EB8578052B490A303ba3370cC

            //TODO : Save info in polybase 

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