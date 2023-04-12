import Image from 'next/image';
import house from '../assets/house.svg';
import arrow from '../assets/arrow.svg'

const Search = () => {
    return (
        <header className='flex flex-col justify-center gap-[62px] items-center'>
            <h2 className="header__title">
                Search it, Explore it. Buy it
            </h2>
            <div className='relative w-[524px] h-[80px]'>
                <input
                    type="text"
                    className="header__search"
                />
                <h1 className='header_adress absolute top-[20px] left-[161px]'>
                    Enter a address
                </h1>
                <Image src={house} alt='house' className=' right-[161px] top-[22px] absolute' />
            </div>
            <Image src={arrow} alt='Arrow' className='mt-[62px]'/>
        </header>
    );
}

export default Search;