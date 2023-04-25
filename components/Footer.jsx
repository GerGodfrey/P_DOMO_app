import React from 'react';
import logofooter from '../assets/logofooter.svg';
import Image from 'next/image';
import instagram from '../assets/instagram.svg';
import twitter from '../assets/twitter.svg';
import facebook from '../assets/facebook.svg';
import linkedin from '../assets/linkedin.svg';

const Footer = () => {
    return (
        <div>
            <div className='degradFooter flex justify-end flex-col sm:h-[522px]'>
                <section className='flex flex-col sm:flex sm:flex-row sm:justify-around sm:mb-[149px] mb-[50px] items-center justify-center gap-[40px]'>
                    <Image src={logofooter} alt='Logo footer' className='w-[40%] sm:w-[20%] md:w-[20%]' />
                    <div className='flex flex-col sm:flex sm:flex-row items-center sm:items-start  gap-[30px]'>
                        <div>
                            <h1 className='textInput sm:text-left text-pink2'>
                                ACERCA DE DOMO
                            </h1>
                        </div>
                        <div>
                            <h1 className='textInput sm:text-left text-pink2'>
                                EXPLORA
                            </h1>
                            <div>
                                <p className='textmenu text-[12px] text-center sm:text-left'>
                                    Centro de dudas
                                </p>
                            </div>
                        </div>
                        <div>
                            <h1 className='textInput sm:text-left text-pink2'>
                                ALIANZAS
                            </h1>
                            <div className='flex flex-col gap-2'>
                                <p className='textmenu text-[12px] text-center sm:text-left'>
                                    Quiero vender un inmueble
                                </p>
                                <p className='textmenu text-[12px] text-center sm:text-left'>
                                    Soy VC, Angel o similar
                                </p>
                                <p className='textmenu text-[12px] text-center sm:text-left'>
                                    Quiero ser aliado estratégico
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2  auto-rows-fr gap-[35px]'>
                        <Image src={instagram} alt='Instagram' />
                        <Image src={facebook} alt='Facebook' />
                        <Image src={linkedin} alt='Linkedin' />
                        <Image src={twitter} alt='Twitter' />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Footer;