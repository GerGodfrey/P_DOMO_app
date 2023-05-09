import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PopCongrats } from '../components';
import { utils } from 'ethers';
import close1 from '../assets/close1.svg';
import Image from 'next/image';
import price from '../assets/price.svg';
import type1 from '../assets/type1.svg';
import bed from '../assets/bed.svg';
import bath from '../assets/bath.svg';
import square from '../assets/square.svg';
import calendar from '../assets/calendar.svg';
import { useForm } from 'react-hook-form';


const PopHome = ({ home, provider, escrow, realEstate, togglePop }) => {
    const router = useRouter();
    let data = router.query.data
    if (data) { data = utils.getAddress(data) }
    const [account, setAccount] = useState(data)

    const [inspector, setInspector] = useState(null)
    const [seller, setSeller] = useState(null)
    const [souldOut, setSouldOut] = useState(false)
    const [isSouldOut, setIsSouldOut] = useState(false)
    const [inspectionPassed, setInspectionPassed] = useState(false)
    const [balance, setBalance] = useState(null)

    const [owner, setOwner] = useState(null)
    const [hasBought, setHasBought] = useState(false)
    const [hasInspected, setHasInspected] = useState(false)
    const [hasSold, setHasSold] = useState(false)
    const [buyer, setBuyer] = useState(null)
    const [toggleinfo, setToggleinfo] = useState(true);
    const { handleSubmit, register } = useForm();

    const tokens = (n) => {
        return ethers.utils.parseUnits(n.toString(), 'ether')
    }

    const buyHandler = async () => {
        if (account) {
            const signer = await provider.getSigner()
            //const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            //const account8 = ethers.utils.getAddress(accounts[0])
            let new_Supply = home.totalSupply + 1
            const publicPrice = Number(await realEstate.publicPrice())

            let price = Number(await realEstate.publicPrice())
            let decimals_price = Number(await realEstate.decimals())
            let real_price = (price / decimals_price)
            try {
                let transaction = await escrow.connect(signer).list(new_Supply, account, tokens(real_price))
                await transaction.wait()

                // Buyer deposit earnconst signer = await provider.getSigner()est
                transaction = await escrow.connect(signer).depositEarnest(new_Supply, { value: tokens(real_price) })
                await transaction.wait()

                let escrow_balance = Number(await escrow.getBalance())
                console.log("escrow_balance", escrow_balance)

                console.log("hasBought", hasBought)
                setHasBought(true)
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("Conecta una Wallet")
        }
    }

    const appInspection = async () => {
        console.log("Approve Inspection:");
        const signer = await provider.getSigner()

        console.log(signer)
        let transaction = await escrow.connect(signer).updateInspectionStatus(true)
        await transaction.wait()
        const inspectionPassed = (await escrow.inspectionPassed()).toString();
        setInspectionPassed(inspectionPassed);
    }

    const finish = async () => {
        console.log("Finish:");
        const signer = await provider.getSigner()
        let transaction = await escrow.connect(signer).finalizeSale(1)
        await transaction.wait()
    }

    useEffect(() => {

        const fetchSouldOut = async () => {
            if (home.percentage == 100) {
                setSouldOut(true)
            }
        }
        fetchSouldOut()
            .catch(console.error);;

        const fetchDetails = async () => {
            // const buyer = await escrow.buyer(home.id)
            // setBuyer(buyer)

            // const hasBought = await escrow.approval(home.id, buyer)
            // setHasBought(hasBought)

            const seller = await escrow.seller()
            setSeller(seller)
            const inspector = await escrow.inspector()
            setInspector(inspector)
            const hasSold = await escrow.approval(home.id, seller)
            setHasSold(hasSold)
            const hasInspected = await escrow.inspectionPassed()
            setHasInspected(hasInspected)
        }
        fetchDetails()
            .catch(console.error);;

        const fetchEscrow = async () => {
            const isSouldOut = (await escrow.isSouldOut()).toString();
            setIsSouldOut(isSouldOut);

            const inspectionPassed = (await escrow.inspectionPassed()).toString();
            setInspectionPassed(inspectionPassed);

            const balance = Number(await escrow.getBalance());
            setBalance(balance);
        }
        fetchEscrow()
            .catch(console.error);;

    });

    const submit = (Info) => {
        console.log(Info)


    }

    return (
        <div className="modal">
            <div className='cardModal'>
                <Image src={close1} alt="close" onClick={togglePop} className='absolute top-[30px] right-[30px] cursor-pointer' />
                <h1 className='tittlePop'>
                    {home.name}
                </h1>
                <div className='collage'>
                    <div className='sm:overflow-hidden col-span-2 row-span-5 brightness-75  hover:brightness-100'>
                        <img src={home.principal_image} alt='Home' className='imageStyle' />
                    </div>
                    <div className='sm:overflow-hidden col-span-2 row-span-2 brightness-75  hover:brightness-100'>
                        <img src={home.img_bed_rooms} alt='Home' className='imageStyle' />
                    </div>
                    <div className='sm:overflow-hidden col-span-2 row-span-3 brightness-75  hover:brightness-100'>
                        <img src={home.img_bathrooms} alt='Home' className='imageStyle' />
                    </div>
                    <div className='sm:overflow-hidden col-span-2 row-span-3 brightness-75  hover:brightness-100'>
                        <img src={home.img_other} alt='Home' className='imageStyle' />
                    </div>
                    <div className='sm:overflow-hidden col-span-2 row-span-2 brightness-75  hover:brightness-100'>
                        <img src={home.img_last} alt='Home' className='imageStyle' />
                    </div>
                </div>
                <div className='flex flex-col gap-[50px] w-full'>
                    <h1 className='textFacts'>
                        Características
                    </h1>
                    <div className='flex flex-col items-center gap-10 sm:flex sm:flex-row sm:justify-around'>
                        <div className='grid grid-cols-2 gap-x-[80px] gap-y-[20px] items-center text-center'>
                            <div className='flex flex-col items-center gap-[20px]'>
                                <Image src={price} alt='Price' />
                                <p className='textmenu text-[12px] md:text-[16px] font-normal text-center'>
                                    Precio
                                </p>
                                <h2 className='tittlePop text-[14px] md:text-[16px]  text-white1'>
                                    {home.total_price} MXN
                                </h2>
                            </div>
                            <div className='flex flex-col items-center gap-[20px]'>
                                <Image src={type1} alt='Type' />
                                <p className='textmenu font-normal text-[12px] md:text-[16px]  text-center'>
                                    Tipo de residencia
                                </p>
                                <h2 className='tittlePop text-[14px] md:text-[16px] text-white1'>
                                    {home.residence}
                                </h2>
                            </div>
                            <div className='flex flex-col items-center gap-[20px]'>
                                <Image src={bed} alt='Bedroom' />
                                <p className='textmenu font-normal text-[12px] md:text-[16px]  text-center'>
                                    Recámaras
                                </p>
                                <h1 className='tittlePop text-[14px] md:text-[16px] text-white1'>
                                    {home.bed_rooms}
                                </h1>
                            </div>
                            <div className='flex flex-col items-center gap-[20px]'>
                                <Image src={bath} alt='Bathroom' />
                                <p className='textmenu font-normal text-[12px] md:text-[16px]  text-center'>
                                    bathrooms
                                </p>
                                <h1 className='tittlePop text-[14px] md:text-[16px] text-white1'>
                                    {home.bathrooms}
                                </h1>
                            </div>
                            <div className='flex flex-col items-center gap-[20px]'>
                                <Image src={square} alt='Calendar' />
                                <p className='textmenu font-normal text-[12px] md:text-[16px]  text-center'>
                                    Metros Cuadrados
                                </p>
                                <h1 className='tittlePop text-[14px] md:text-[16px] text-white1'>
                                    {home.square_feet}
                                </h1>
                            </div>
                            <div className='flex flex-col items-center gap-[20px]'>
                                <Image src={calendar} alt='Price' />
                                <p className='textmenu font-normal text-[12px] md:text-[16px]  text-centers'>
                                    Año Construcción
                                </p>
                                <h1 className='tittlePop text-[14px] md:text-[16px] text-white1'>
                                    {home.year_built}
                                </h1>
                            </div>
                        </div>
                        {
                            toggleinfo && (
                                <div className='cardInfo'>
                                    <div className='flex w-full justify-between hover:cursor-pointer'>
                                        <p className='select' style={{ backgroundColor: toggleinfo ? "transparent" : "#1E2022" }}>
                                            Precio
                                        </p>
                                        <p className='select bg-background' onClick={() => setToggleinfo(false)}>
                                            Más Info
                                        </p>
                                    </div>
                                    <div className='flex flex-col gap-[55px] mt-[75px]'>
                                        <div className='flex justify-around'>
                                            <h1 className='textmenu'>
                                                Total Fracciones
                                            </h1>
                                            <span className='textmenu font-normal text-center'>
                                                {home.totalSupply} / {home.maxSupply}
                                            </span>
                                        </div>
                                        <div className='flex justify-around'>
                                            <h1 className='textmenu'>
                                                Precio Fracción
                                            </h1>
                                            <span className='textmenu font-normal text-center'>
                                                {home.purchase_price} MATIC
                                            </span>
                                        </div>
                                        {
                                            (souldOut && (account !== inspector && account !== seller)) ? (

                                                <div className='flex w-full items-center justify-center'>
                                                    <span className='soldOut'>
                                                        Sould OUT !!
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className='flex flex-col justify-center items-center'>
                                                    {(account === inspector) ? (
                                                        <button className='btnBuy ' onClick={appInspection}>
                                                            Approve Inspection
                                                        </button>
                                                    ) : (account === seller) ? (
                                                        <button className='btnBuy'>
                                                            Approve & Sell
                                                        </button>
                                                    ) : (
                                                        <div className='flex flex-col justify-center items-center'>
                                                            <button className='btnBuy ' onClick={buyHandler} >
                                                                Buy
                                                            </button>
                                                            <button className='btnContact' >
                                                                Buy FIAT
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        }
                                        <div>
                                            <hr className='invisible' />
                                            {(account === inspector) ? (

                                                <div>
                                                    <p>Soud OUT : {isSouldOut}</p>
                                                    <p>Inspection : {inspectionPassed}</p>
                                                    <p>Balance: {balance} ETH</p>
                                                    <button className='btnContact' onClick={finish}> Finalize Sale </button>
                                                </div>

                                            ) : (
                                                <hr className='invisible'></hr>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        {
                            !toggleinfo && (
                                <div className='cardInfo h-[790px]'>
                                    <div className='flex w-full justify-between hover:cursor-pointer'>
                                        <p className='select' style={{ backgroundColor: !toggleinfo ? "#1E2022" : "#1E2022" }} onClick={() => setToggleinfo(true)}>
                                            Precio
                                        </p>
                                        <p className='select' style={{ backgroundColor: !toggleinfo ? "transparent" : "#1E2022" }} >
                                            Más Info
                                        </p>
                                    </div>
                                    <div className='flex flex-col gap-[55px] mt-[75px] mr-[13px] ml-[12px]'>
                                        <div className='flex flex-col justify-around'>
                                            <p className='textmenu font-normal'>
                                                Por favor compartenos tu nombre y correo electronico y te enviaremos más información de esta propiedad.
                                            </p>
                                        </div>
                                        <form onSubmit={handleSubmit(submit)} className='flex flex-col gap-[55px]'>
                                            <div className='flex flex-col gap-[32px]'>
                                                <h1 className='textmenu'>
                                                    Ingresa correo electronico <br /> valido
                                                </h1>
                                                <input type="text" className='inputInfo' placeholder='' id='email' {...register("email", {required:true})} />
                                            </div>
                                            <div className='flex flex-col gap-[32px]'>
                                                <h1 className='textmenu'>
                                                    Ingresa tu nombre completo
                                                </h1>
                                                <input type="text" className='inputInfo' placeholder='' id='name' {...register("name", {required:true})}  />
                                            </div>
                                            <div className='w-full flex justify-center'>
                                                <button className='btnBuy'>
                                                    Enviar
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className='flex flex-col gap-[25px]'>
                        <h1 className='textFacts'>
                            Description
                        </h1>
                        <p className='textWallet font-normal'>
                            {home.long_description}
                        </p>
                    </div>
                </div>
            </div>
            {hasBought && (
                <PopCongrats />
            )}
        </div>
    );
}

export default PopHome;
