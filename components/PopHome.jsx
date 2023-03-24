// eslint-disable-next-line 
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

const PopHome = ({ home, provider,account, escrow, realEstate, togglePop }) => {    
    const [lender,setLender] =useState(null)
    const [inspector,setInspector] =useState(null)
    const [seller,setSeller] =useState(null)
    const[souldOut, setSouldOut] = useState(false)
    const [isSouldOut,setIsSouldOut] = useState(false)
    const [inspectionPassed,setInspectionPassed] = useState(false)
    const [balance,setBalance] = useState(null)

    const[owner, setOwner] = useState(null)
    const [hasBought, setHasBought] = useState(false)
    const [hasLended, setHasLended] = useState(false)
    const [hasInspected, setHasInspected] = useState(false)
    const [hasSold, setHasSold] = useState(false)
    const [buyer,setBuyer] =useState(null)

    const tokens = (n) => {
        return ethers.utils.parseUnits(n.toString(), 'ether')
    }

    const buyHandler = async () => {
        if(account){
            const signer = await provider.getSigner()
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = ethers.utils.getAddress(accounts[0])
            const new_Supply = home.totalSupply+1
            const publicPrice = Number(await realEstate.publicPrice())

            let transaction = await realEstate.connect(signer).mint();
            await transaction.wait();

            transaction = await realEstate.connect(signer).approve(escrow.address,new_Supply)
            await transaction.wait()  
            
            transaction = await escrow.connect(signer).list(new_Supply, account, tokens(publicPrice))
            await transaction.wait()

            // Buyer deposit earnest
            transaction = await escrow.connect(signer).depositEarnest(new_Supply, { value: tokens(publicPrice) })
            await transaction.wait()

            // Buyer approves...
            transaction = await escrow.connect(signer).approveSale(new_Supply)
            await transaction.wait()

            let escrow_balance = Number(await escrow.getBalance())
            // setHasBought(true)
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

            const lender = await escrow.lender()
            setLender(lender)

            const inspector = await escrow.inspector()
            setInspector(inspector)
            
            const hasSold = await escrow.approval(home.id, seller)
            setHasSold(hasSold)
    
            const hasLended = await escrow.approval(home.id, lender)
            setHasLended(hasLended)

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

        // const fetchOwner = async () => {
        //     const variable = await escrow.isListed(home.id) 
        //     if (variable) {
        //         const owner = await escrow.buyer(home.id)
        //         setOwner(owner)
        //     }
        // }
        // fetchOwner()        
    }) 

    return (
        <div className="home">
            <div className='home__details'>
                <div className='home__image'>
                    <img src={home.image} alt='Home' className='rounded-[30px]'/>
                </div>

                <div className='home__overview'>
                    <h1 className='text-[30px]'>{home.name}</h1>
                    <h2 className='text-[30px]'>Total: {home.totalSupply} / {home.maxSupply}</h2>
                    <h2>Precio: {home.attributes[0].value} ETH</h2>
                    <p> {home.address}</p>
                    
                    {
                    (souldOut && (account !== inspector && account !== lender && account !== seller) ) ? (
                        <div className='home__owned'>
                            Sould OUT !! 
                        </div>
                    ) : (
                        <div> 
                            {(account === inspector) ? (
                                <button className='home__buy' onClick={appInspection}>
                                    Approve Inspection
                                </button>
                            ) : ( account === lender) ? (
                                <button className='home__buy'>
                                    Approve & Lend 
                                </button>
                            ) : (account === seller) ? (
                                <button className='home__buy'>
                                    Approve & Sell
                                </button>
                            ) : (
                                <div>
                                    <button className='home__buy' onClick={buyHandler} >
                                        Buy
                                    </button>
                                    <button className='home__contact' >
                                        Buy FIAT
                                    </button>
                                </div>
                            )}
                            
                        </div>
                    )}

                    <div>
                        <hr /> 
                        <p>
                            {home.description}
                        </p>
                        <hr />
                        <h2> Facts and Features</h2>
                        <ul>
                            {home.attributes.map((attribute, index)=> (
                                <li key={index}>
                                    <strong>
                                        {attribute.trait_type}
                                    </strong> : {attribute.value}
                                </li>
                            ))}
                        </ul>

                        {(account === inspector) ? (
                            
                            <div>
                                <p>Soud OUT : {isSouldOut}</p>
                                <p>Inspection : {inspectionPassed}</p>
                                <p>Balance: {balance} ETH</p>
                                <button className='home__contact' onClick={finish}> Finalize Sale </button>
                            </div>
                            
                        ) : (
                            <hr></hr>
                        )}
                    </div>
                </div>
                <button onClick={togglePop} className='home__close'>
                    <p className=' text-white'>
                        X
                    </p>
                </button>
            </div>
        </div>
    );
}

export default PopHome;
 