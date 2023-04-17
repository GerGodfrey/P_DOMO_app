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
            <div className='footerdegrad flex justify-end flex-col'>
                <section className='flex justify-around mb-[149px] flex-wrap items-center'>
                    <div>
                        <Image src={logofooter} alt='Logo footer' />
                    </div>
                    <div className='flex gap-[50px] flex-wrap'>
                        <div>
                            <h1 className='footertitle'>
                                ACERCA DE DOMO
                            </h1>
                        </div>
                        <div>
                            <h1 className='footertitle'>
                                EXPLORA
                            </h1>
                            <div>
                                <p className='footertext'>
                                    Centro de dudas
                                </p>
                            </div>
                        </div>
                        <div>
                            <h1 className='footertitle'>
                                ALIANZAS
                            </h1>
                            <div>
                                <p className='footertext'>
                                    Quiero vender un inmueble
                                </p>
                                <p className='footertext'>
                                    Soy VC, Angel o similar
                                </p>
                                <p className='footertext'>
                                    Quiero ser aliado estratégico
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 grid-rows-2 gap-[35px]'>
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