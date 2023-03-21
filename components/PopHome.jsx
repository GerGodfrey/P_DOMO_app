// eslint-disable-next-line 
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import close from '../assets/close.svg';

const PopHome = ({ home, provider,account, escrow, togglePop }) => {

    
    // eslint-disable-next-line 
    const [hasBought, setHasBought] = useState(false)
    // eslint-disable-next-line
    const [hasLended, setHasLended] = useState(false)
    // eslint-disable-next-line
    const [hasInspected, setHasInspected] = useState(false)
    // eslint-disable-next-line
    const [hasSold, setHasSold] = useState(false)

    // eslint-disable-next-line 
    const [buyer,setBuyer] =useState(null)
    // eslint-disable-next-line 
    const [lender,setLender] =useState(null)
    // eslint-disable-next-line 
    const [inspector,setInspector] =useState(null)
    // eslint-disable-next-line 
    const [seller,setSeller] =useState(null)
    // eslint-disable-next-line 
    const[owner, setOwner] = useState(null)
    
    
    useEffect(() => {

        const fetchOwner = async () => {
            const variable = await escrow.isListed(home.id) 
            if (variable) {
                const owner = await escrow.buyer(home.id)
                setOwner(owner)
            }
        }

        fetchOwner()
        .catch(console.error);;
        
        const fetchDetails = async () => {
            const buyer = await escrow.buyer(home.id)
            setBuyer(buyer)
            const hasBought = await escrow.approval(home.id, buyer)
            setHasBought(hasBought)
    
            const seller = await escrow.seller()
            setSeller(seller)
            const hasSold = await escrow.approval(home.id, seller)
            setHasSold(hasSold)
    
            const lender = await escrow.lender()
            setLender(lender)
            const hasLended = await escrow.approval(home.id, lender)
            setHasLended(hasLended)
    
            const inspector = await escrow.inspector()
            setInspector(inspector)
            const hasInspected = await escrow.inspectionPassed(home.id)
            setHasInspected(hasInspected)
    
        }

        fetchDetails()
        .catch(console.error);;
        
    }) 

    return (
        <div className="home">
            <div className='home__details'>
                <div className='home__image'>
                    <img src={home.image} alt='Home' />
                </div>

                <div className='home__overview'>
                    <h1>{home.name}</h1>
                    <p>
                        <strong>{home.attributes[2].value}</strong> bds /
                        <strong>{home.attributes[3].value}</strong> ba /
                        <strong>{home.attributes[4].value}</strong> sqft /
                    </p>
                    <p> {home.address}</p>
                    <h2> {home.attributes[0].value} ETH</h2>

                    {owner ? (
                        <div className='home__owned'>
                            Owned by {owner.slice(0,6) + "..." + owner.slice(38,42)}
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
                                Contact agent 
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
 