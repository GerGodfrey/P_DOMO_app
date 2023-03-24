import Image from 'next/image';
import house from '../assets/house.svg';
import fondo from '../assets/fondo.svg';

const Search = () => {
    return (
        <header className='flex flex-col justify-center gap-6 items-center h-[500px]'>
            <h2 className="header__title">
                Search it, Explore it. Buy it
            </h2>
            <input
                type="text"
                className="header__search"
                placeholder="Enter a address"
                />
            <Image src={house} alt='house' className=' right-[5%] bottom-[35%] absolute' />
        </header>
    );
}

export default Search;