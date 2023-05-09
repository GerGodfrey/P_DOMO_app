import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { personalInfo } from '../constants';
import { motion } from 'framer-motion';
import {Navbar} from '../components';
import { utils } from 'ethers';
import WidgetUpload from '../components/kyc/uploadFiles/index';


const Kyc = () => {
    const router = useRouter();
    let data = router.query.data
    if (data) { data = utils.getAddress(data) }
    const [account, setAccount] = useState(data);
    const [provider, setProvider] = useState(null);
    const { handleSubmit, register } = useForm();
    const [status, setStatus] = useState(true);
    const [userData, setUserData] = useState(null)
 
    function createItem(data,account){
        const data_json = JSON.parse(JSON.stringify(data))
        data_json.id = account

        try{
            // TODO: validar que todos los campos esten llenos 
            setUserData(data_json)
            setStatus(false)
        }catch (error){
            console.error("Error uploading file:",error)
        }
        
    }

    const submit = (data) => {
        if (account) {
            createItem(data,account);
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
                    KYC
                </h1>
                <p className='w-full text-2xl p-4 text-center text-neutral-400 text-gradient2'>
                    Complete todos los campos para su registro exitoso. 
                </p>
                {
                    (status) ? (
                        <form onSubmit={handleSubmit(submit)} className=' lg:w-[800px] md:w-[500px] sm:w-[300px]'>
                        {personalInfo.map((input) => (
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
                            className='w-[200px] mt-10 text-white text-2xl rounded-xl p-7 bg-rgbaGrey my-4'
                        >
                            Siguiente
                        </button>
                    </form>
                    ) : (
                        <WidgetUpload userData={userData}/>
                    )
                }


            </motion.div>
        </div>
    );
};

export default Kyc;