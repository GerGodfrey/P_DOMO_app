const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let seller, inspector, lender,buyer, buyer_2
    let realEstate, escrow

    beforeEach(async () => {

        // Setup accounts
        [buyer, seller, inspector, lender, buyer_2] = await ethers.getSigners()

        // Deploy Real Estate
        const RealEstate = await ethers.getContractFactory('RealEstate')
        realEstate = await RealEstate.deploy()

        // Deploy Escrow
        const Escrow = await ethers.getContractFactory('Escrow')
        escrow = await Escrow.deploy(
            realEstate.address,
            seller.address,
            inspector.address,
            lender.address
        ) 


        // console.log(`Deployed Real Estate Contract at: ${realEstate.address}`)

        // Mint two differentes houses
        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS")
        await transaction.wait()
        let transaction2 = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS")
        await transaction2.wait()        
        // Approve Property
        transaction = await realEstate.connect(seller).approve(escrow.address, 1)
        await transaction.wait()
        transaction2 = await realEstate.connect(seller).approve(escrow.address, 2)
        await transaction2.wait()


        // list property
        transaction = await escrow.connect(seller).list(1, buyer.address, tokens(10), tokens(5))
        await transaction.wait()

        transaction2 = await escrow.connect(seller).list(2, buyer_2.address, tokens(10), tokens(5))
        await transaction2.wait()

    })

    describe ('Deployment', () => {

        it(' Returns NFT address', async() => {
            const result = await escrow.nftAddress()
            expect(result).to.be.equal(realEstate.address)
        })
    
        it('Returns seller', async() => {
            const result = await escrow.seller()
            expect(result).to.be.equal(seller.address)
        })
    
        it('Returns inspector', async() => {
            const result = await escrow.inspector()
            expect(result).to.be.equal(inspector.address)
        })
    
        it('Returns lender', async() => {
            const result = await escrow.lender()
            expect(result).to.be.equal(lender.address)
        })

    })

    describe ('Listing', () => {

        it('Updates as listed',async () => {
            const result = await escrow.isListed(1)
            expect(result).to.be.equal(true)
        })

        it('Updates as listed',async () => {
            const result = await escrow.isListed(2)
            expect(result).to.be.equal(true)
        })

        it ('Updates ownership', async () => {
            expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address)
        })

        it ('Updates ownership', async () => {
            expect(await realEstate.ownerOf(2)).to.be.equal(escrow.address)
        })

        it ('Returns buyer',async() => {
            const result = await escrow.buyer(1)
            expect(result).to.be.equal(buyer.address)
        })

        it ('Returns buyer_2',async() => {
            const result = await escrow.buyer(2)
            expect(result).to.be.equal(buyer_2.address)
        })

        it ('Returns purchase price',async() => {
            const result = await escrow.purchasePrice(1)
            expect(result).to.be.equal(tokens(10))
        })

        it ('Returns escrow amount',async() => {
            const result = await escrow.escrowAmount(1)
            expect(result).to.be.equal(tokens(5))
        })

    })

    describe ('Deposits', () => {

        it ('Updates contract balances', async () => {
            const transaction = await escrow.connect(buyer).depositEarnest(1, {value: tokens(5)})
            await transaction.wait()

            // const transaction2 = await escrow.connect(buyer).depositEarnest(2, {value: tokens(5)})
            // await transaction2.wait()

            const result = await escrow.getBalance()
            expect(result).to.be.equal(tokens(5))
        })
    })

    describe ('Inspection', () => {

        it ('Updates inspection status', async () => {
            const transaction = await escrow.connect(inspector).updateInspectionStatus(1,true)
            await transaction.wait()
            const result = await escrow.inspectionPassed(1)
            expect(result).to.be.equal(true)
            
        })

        it ('Aproval inspection', async () => {
            let transaction = await escrow.connect(buyer).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(seller).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(lender).approveSale(1)
            await transaction.wait()

            expect(await escrow.approval(1,buyer.address)).to.be.equal(true)
            expect(await escrow.approval(1,seller.address)).to.be.equal(true)
            expect(await escrow.approval(1,lender.address)).to.be.equal(true)

        })
    })

    describe ('Sale', () => {
        beforeEach(async () => {
            let transaction = await escrow.connect(buyer).depositEarnest(1,{value: tokens(5)})
            await transaction.wait()

            transaction = await escrow.connect(inspector).updateInspectionStatus(1,true)
            await transaction.wait()

            transaction = await escrow.connect(buyer).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(seller).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(lender).approveSale(1)
            await transaction.wait()

            await lender.sendTransaction({to: escrow.address, value: tokens(5)})

            transaction = await escrow.connect(seller).finalizeSale(1)
            await transaction.wait()
        })

        it('Updates ownership', async () => {
            expect(await realEstate.ownerOf(1)).to.be.equal(buyer.address)
        })

        it('Updates balances', async () =>{
            expect( await escrow.getBalance()).to.be.equal(0)
        })
    })
})