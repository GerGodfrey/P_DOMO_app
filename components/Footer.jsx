import React from 'react';
import logofooter from '../assets/logofooter.svg';
import Image from 'next/image';
import instagram from '../assets/instagram.svg';
import twitter from '../assets/twitter.svg';
import facebook from '../assets/facebook.svg';
import linkedin from '../assets/linkedin.svg';
import Link from 'next/link';

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
                                <Link href={"/Doubts"}>
                                    <p className='textmenu text-[12px] text-center sm:text-left'>
                                        Centro de dudas
                                    </p>
                                </Link>
                            </div>
                        </div>
                        <div>
                            <h1 className='textInput sm:text-left text-pink2'>
                                ALIANZAS
                            </h1>
                            <div className='flex flex-col gap-2 hover:cursor-pointer'>
                                <p className='textmenu text-[12px] text-center sm:text-left' onClick={() => window.open( "https://domopro.xyz/#/regprop")}>
                                    Quiero vender un inmueble
                                </p>
                                <p className='textmenu text-[12px] text-center sm:text-left' onClick={() => window.open('https://domopro.xyz/#/investor')}>
                                    Soy VC, Angel o similar
                                </p>
                                <p className='textmenu text-[12px] text-center sm:text-left' onClick={() => window.open('https://domopro.xyz/#/partner')}>
                                    Quiero ser aliado estratégico
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2  auto-rows-fr gap-[35px]'>
                        <Image src={instagram} alt='Instagram' onClick={() => window.open("https://www.instagram.com/domo_project/?hl=en")} className=' hover:cursor-pointer' />
                        <Image src={facebook} alt='Facebook' onClick={() => window.open("https://www.instagram.com/domo_project/?hl=en")} className=' hover:cursor-pointer' />
                        <Image src={linkedin} alt='Linkedin' onClick={() => window.open("https://www.linkedin.com/")} className=' hover:cursor-pointer' />
                        <Image src={twitter} alt='Twitter' onClick={() => window.open("https://twitter.com/_DomoProject")} className=' hover:cursor-pointer' />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Footer;