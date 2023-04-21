import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { inputInfo } from '../constants';
import { motion } from 'framer-motion';
import {Navbar} from '../components';
//import styles from '../style';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';

const Create = () => {

    const [fileUrl, setFileUrl] = useState(null);
    const { handleSubmit, register } = useForm();


    async function onchange(e){
        const file = e.target.files[0]
        try{
            const added = await client.add(
                file,
                {
                    progress: (prog) => {
                        console.log(prog)
                    }
                }
            )
            const url = 'https://ipfs.infura.io/ipfs/${added.path}'
            setFileUrl(url)

        }catch(e){
            console.log(e)
        }
    }

    async function createItem(data){
        console.log('Creating')

        const auth = 'Basic ' + Buffer.from("2OhsFmhCv72vOMT2Lr2pnJZBGnf" + ':' + "8d1c6baacb1ee0ca248ca7e151a9a8d2").toString('base64');

        const client = create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
                authorization: auth,
            }, 
        });

        console.log(client)
        try{
            const new_data = JSON.stringify(data)
            const added = await client.add(new_data)
            const url = 'https://ipfs.io/ipfs/'+added.path+""
            console.log(url)
            // createSale(url)
        }catch (error){
            console.log("Error uploading file:",error)
        }
    }

    const submit = (data) => {
        console.log(data);
        //sendInfo(data);
        createItem(data);
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