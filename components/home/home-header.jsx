import logo_color from '../../assets/logo_color.svg'
import Image from 'next/image';

const HomeHeader = () => {
    return (
      <div style={{ textAlign: 'center' }}>
        <Image src={logo_color} alt='DOMO LOGO' className='flex object-fill h-48 w-96'/>
        <h3 className="demo-sub-header">Demo V 1.0.2</h3>
      </div>
    );
  };
  
export default HomeHeader;