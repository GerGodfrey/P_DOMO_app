import Image from 'next/image';
import house from '../assets/house.svg';
import arrow from '../assets/arrow.svg'
import { useEffect, useState } from 'react';
import axios from 'axios';

const Search = () => {

    const [directionsResponse, setDirectionsResponse] = useState(null)


    const [search, setSearch] = useState(true);


    return (
        <header className='flex flex-col justify-center gap-[62px] items-center'>
            <h2 className="tittleHeader md:text-[48px]">
                Search it, Explore it. Buy it
            </h2>
            <div className='relative w-[290px] h-[50px] sm:w-[524px] sm:h-[80px]'>
                <input
                    type="text"
                    className="inputSearch placeholder1 sm:w-[524px] sm:h-[80px]"
                    onClick={() => setSearch(false)}
                    placeholder={search ? null : 'Ingresa tu dirección'}
                />
                {search ?
                    <div>
                        <h1 className='textInput sm:text-[16px] absolute sm:top-[26px] sm:left-[151px] top-[14px] left-[121px]'>
                            Enter address
                        </h1>
                        <Image src={house} alt='house' className=' sm:right-[181px] sm:top-[25px] right-[181px] top-[10px] absolute' />
                    </div>
                    : null}
            </div>
            <Image src={arrow} alt='Arrow' className='sm:mt-[62px] mt-[10px] w-[7%]' />
        </header>
    );
}

export default Search;