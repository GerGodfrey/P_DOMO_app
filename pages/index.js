import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Search, PopHome, Navbar } from '../components'
import { Polybase } from '@polybase/client'
import { useRouter } from 'next/router';
import { utils } from 'ethers';
import Image from 'next/image';
import Footer from '@/components/Footer';
import backgroundDaap from '../assets/search.png';
import arrowDown from '../assets/arrow-down.svg';
import glass from '../assets/glass.svg';
import { sc_factory_localhost, sc_factory_tesnet } from '../config'
//import Escrow_LH from '../artifacts/contracts/Escrow.sol/Escrow.json'
//import Factory_LH from '../artifacts/contracts/RealEstate.sol/Factory.json' Factory_LH.abi
//import RealEstate_LH from '../artifacts/contracts/RealEstate.sol/RealEstate.json' RealEstate_LH.abi
import Escrow from '../constants/Escrow_metadata.json' // Escrow.output.abi
import Factory from '../constants/Factory_metadata.json' //Factory.output.abi
import RealEstate from '../constants/RealEstate_metadata.json' //RealEstate.output.abi





export default function Home() {
  const router = useRouter();
  let data = router.query.data
  if (data) { data = utils.getAddress(data) }
  const [account, setAccount] = useState(data)
  const [provider, setProvider] = useState(null)
  const [homes, setHomes] = useState([])
  const [home, setHome] = useState([])
  const [toggle, setToggle] = useState(false)
  const [escrow, setEscrow] = useState(null)
  const [realEstate, setRealEstate] = useState(null)

  const polybase_name = process.env.NEXT_PUBLIC_POLYBASE_NAME

  const dataBase_sc = new Polybase({
    defaultNamespace: process.env.NEXT_PUBLIC_NAME_ESPACE,
  });


  const loadData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    //const network = await provider.getNetwork()
    const factory = new ethers.Contract(sc_factory_tesnet, Factory.output.abi, provider)
    const total_rs = Number(await factory.totalRealEstate())
    const homes = []

    const collectionReference = dataBase_sc.collection(polybase_name);
    const records = await collectionReference.get("escrow_contract");

    for (var i = 0; i < total_rs; i++) {
      const address_re = await factory.RealEstateArray(i);
      const realEstate = new ethers.Contract(address_re, RealEstate.output.abi, provider);

      const address_escrow = records.data[i].data.escrow_contract
      const escrow = new ethers.Contract(address_escrow, Escrow.output.abi, provider);
      const totalSupply = Number(await escrow.totalSupply());
      const maxSupply = Number(await escrow.maxSupply());

      const data = await realEstate.tokenDATA();
      console.log("DATA",data)
      const response = await fetch(data);
      console.log("RESPONSE",response)
      var metadata = await response.json();
      console.log("METADATA",metadata)
      metadata["address_escrow"] = address_escrow;
      metadata["address_re"] = address_re;
      metadata["totalSupply"] = totalSupply;
      metadata["maxSupply"] = maxSupply;
      metadata["percentage"] = totalSupply * 100 / maxSupply;

      homes.push(metadata);
    }
    setHomes(homes)

  }

  const changeWallet = async () => {
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account);
    })
  }

  async function connectDB(address_re) {
    let db = new Polybase({
      defaultNamespace: "pk/0x7fd09c2b6e44027ed2b6e478a5ff36e201317a6d4734e3ae4868827740ecf53265bff10a510904fc12fd98e277fb8af107f463425346ae359b19f25754bbf9fb/DOMO",
    });
    const collectionReference = db.collection(polybase_name);
    const records = await collectionReference.where("real_estate_contract", "==", address_re).get();
    const escrow_contract = records.data[0].data.escrow_contract
    return escrow_contract;
  }

  useEffect(() => {
    changeWallet(),
      loadData()
  }, [])

  const togglePop = (home) => {

    setHome(home);
    const escrow_contract = connectDB(home.address_re);
    const escrow = new ethers.Contract(escrow_contract, Escrow.output.abi, provider);
    setEscrow(escrow);

    if (!toggle && account) {
      const realEstate = new ethers.Contract(home.address_re, RealEstate.output.abi, provider);
      setRealEstate(realEstate);
      const escrow = new ethers.Contract(home.address_escrow, Escrow.output.abi, provider);
      setEscrow(escrow)

      console.log(escrow.address)
    }

    toggle ? setToggle(false) : setToggle(true)
  }

  return (
    <div>
      <div className='relative min-h-[500px] sm:min-h-[700px] md:min-h-[1000px] flex flex-col gap-[145px]'>
        <Image src={backgroundDaap} alt='Background' className='absolute top-0 bottom-0 z-[-1]' />
        <Navbar />
        <Search />
      </div>
      <div className='mb-[85px]'>
        {
          (provider) ? (
            (provider.provider.networkVersion === "80001") ? (
              <h1 className='tittleHeader text-left ml-[60px] mt-[40px]'> Some Opportunities: </h1>
            ) : (
              <h1 className='tittleHeader'> Please, connect to Polygon Mumbai Blockchain </h1>
            )
          ) : (
            <h1 className='tittleHeader'> Please, install Some Wallet</h1>
          )
        }
        <div className='flex flex-col md:justify-around md:flex md:flex-row items-center gap-10 mt-[80px]'>
          <div className='flex flex-col gap-[30px]'>
            <p className='textInput md:text-[21px] md:text-left'>
              Search
            </p>
            <div className='relative'>
              <input type='text' className='inputMain text-[#FFFFFF] pl-[60px] md:w-[557px] md:h-[68.19px]' />
              <Image src={glass} alt='magnificy glass' className='absolute top-[30%] left-5' />
            </div>
          </div>
          <div className='flex flex-col gap-[30px]'>
            <p className='textInput md:text-[21px] md:text-left'>
              Select state
            </p>
            <div className='relative'>
              <option className='inputMain md:w-[159.63px] md:h-[68.19px] w-[120px] h-[60px]'>
              </option>
              <Image src={arrowDown} alt='arrow down' className='absolute right-5 top-[40%]' />
            </div>
          </div>
          <div className='flex flex-col gap-[30px]'>
            <p className='textInput md:text-[21px] md:text-left'>
              Order by
            </p>
            <div className='relative'>
              <option className='inputMain md:w-[159.63px] md:h-[68.19px] w-[120px] h-[60px]'>
              </option>
              <Image src={arrowDown} alt='arrow down' className='absolute right-5 top-[40%]' />
            </div>
          </div>
        </div>

        <div className='flex justify-around flex-wrap  mt-[120px] mb-[120px]'>
          {homes.map((home, index) => (
            <div class="card max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 justify-evenly hover:bg-[#EE2A7B] hover:cursor-pointer" key={index} onClick={() => togglePop(home)}>
                <a href="#">
                    <img class="rounded-t-lg" src={home.principal_image} alt="Home" />
                </a>
                <div class="p-5">
                    <a href="#">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{home.name}</h5>
                    </a>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"> {home.description}</p>
                    <div className="progressBar" style={{ width: `${home.percentage}%` }}>
                      {home.percentage}%
                    </div>

                    
                </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      {toggle && (
        <PopHome home={home} provider={provider} escrow={escrow} realEstate={realEstate} togglePop={togglePop} />
      )}
    </div>
  );
}
