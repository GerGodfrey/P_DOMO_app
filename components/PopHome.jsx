// eslint-disable-next-line 
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import close from '../assets/close.svg';

const PopHome = ({ home, provider,account, escrow, togglePop }) => {    
    const [lender,setLender] =useState(null)
    const [inspector,setInspector] =useState(null)
    const [seller,setSeller] =useState(null)
    const[souldOut, setSouldOut] = useState(false)

    const[owner, setOwner] = useState(null)
    const [hasBought, setHasBought] = useState(false)
    const [hasLended, setHasLended] = useState(false)
    const [hasInspected, setHasInspected] = useState(false)
    const [hasSold, setHasSold] = useState(false)
    const [buyer,setBuyer] =useState(null)

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
            console.log("inspector: ",inspector)
            console.log("account:", account)
            
            console.log(inspector === account)
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
                    <img src={home.image} alt='Home' />
                </div>

                <div className='home__overview'>
                    <h1>{home.name}</h1>
                    <h1>Total: {home.totalSupply} / {home.maxSupply}</h1>
                    <h2>Precio: {home.attributes[0].value} ETH</h2>
                    <p> {home.address}</p>
                    
                    {souldOut ? (
                        <div className='home__owned'>
                            Sould OUT !! 
                        </div>
                    ) : (
                        <div> 
                            {(account === inspector) ? (
                                <button className='home__buy'>
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
                                <button className='home__buy'>
                                    Buy
                                </button>
                            )}

                            <button className='home__contact'>
                                Buy FIAT
                            </button>
                        </div>
                    )}

                    <div>
                        <hr /> 
                        <h2>Overview</h2>
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
                    </div>
                </div>
                <button onClick={togglePop} className='home__close'>
                    <img src={close} alt = 'Close' />
                </button>
            </div>
        </div>
    );
}

export default PopHome;
 