import Image from 'next/image';
import house from '../assets/house.svg';

const Search = () => {
    return (
        <header className='flex flex-col justify-center gap-6 items-center h-[120vh]'>
            <h2 className="header__title">
                Search it, Explore it. Buy it
            </h2>
            <div className={`relative`}>
                <input
                    type="text"
                    className="header__search"
                    placeholder="Enter a address"
                />
                <Image src={house} alt='house' className=' right-[5%] bottom-[35%] absolute' />
            </div>
        </header>
    );
}

export default Search;