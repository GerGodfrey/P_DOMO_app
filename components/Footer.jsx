import React from 'react';
import Image from 'next/image';
import instagram from '../assets/instagram.svg';
import twitter from '../assets/twitter.svg';
import facebook from '../assets/facebook.svg';
import linkedin from '../assets/linkedin.svg';
import { logo_color } from '@/assets';
import { footerLinks, socialMedia} from '../constants'
import { Link, animateScroll as scroll } from "react-scroll";


const Footer = () => ( 
    <section className="flex justify-center items-center sm:py-16 py-6 lex-col">
        <div className='degradFooter flex justify-end flex-col sm:h-[522px]'>
            <div className="flex justify-center items-start md:flex-row flex-col mb-8 w-full">
                <div className="flex-[1] flex flex-col justify-start mr-10">
                    <Image src={logo_color} alt='Logo footer' className='w-[266px] h-[72.14px] object-contain' />
                    <p className="font-poppins font-normal text-white1 text-[18px] leading-[30.8px] mt-4 max-w-[312px]">
                        Una nueva forma de acceder al mercado inmobiliario.
                    </p>
                </div>

                <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10">
                    {footerLinks.map((footerlink) => (
                        <div key={footerlink.title} className={`flex flex-col ss:my-0 my-4 min-w-[150px]`}>
                            <h4 className="font-poppins font-medium text-[18px] leading-[27px] text-white1">
                                {footerlink.title}
                            </h4>

                            <ul className="list-none mt-4">
                                {footerlink.links.map((link, index) => (
                                    <li
                                        key={link.name}
                                        className={`font-poppins font-normal text-[16px] leading-[24px] text-white1 hover:text-pink1 cursor-pointer ${index !== footerlink.links.length - 1 ? "mb-4" : "mb-0"
                                            }`}
                                    >
                                        <Link to={`${link.route}`}>{link.name}</Link>

                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        

            <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]">
                <p className="font-poppins font-normal text-center text-[18px] leading-[27px] text-white">
                    Copyright Ⓒ 2022 DOMO. Todos los derechos reservados.
                </p>

                <div className="flex flex-row md:mt-0 mt-6">
                    {socialMedia.map((social, index) => (
                        <Image
                        className={`w-[21px] h-[21px] object-contain cursor-pointer ${index !== socialMedia.length - 1 ? "mr-6" : "mr-0"}`}
                            key={social.id}
                            src={social.icon}
                            alt={social.id}
                            onClick={() => window.open(social.link)}
                        />
                    ))}
                </div>
            </div>
        </div>
    </section>
)


export default Footer