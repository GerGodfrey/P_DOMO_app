const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokensString = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const tokens = (n) => {
    return ethers.utils.parseEther(n.toString(), 'ether')
}


describe('Escrow', () => {
    let seller, inspector,buyer, second_buyer, address_rs_1
    let factory,escrow_rs_1,real_estate_1
    let total_rs, max_supply_rs_1, total_supply_rs_1, pre_Balance

    beforeEach(async () => {
        // Setup accounts
        [creator, seller, inspector, buyer, second_buyer] = await ethers.getSigners()
        //console.log("creato:",creator.address)
        // Deploy Factory
        const Factory = await ethers.getContractFactory('Factory')
        factory = await Factory.deploy()
        total_rs = Number(await factory.totalRealEstate())
        console.log(`Deployed Factory Contract at: ${factory.address}`)

        // Mint first Real Estate 
        const supply = 3;
        const price_wei =  1; // 0.1
        const decimals = 10 ; // cuantos ceros recorro 

        const rs_one = await factory.CreateNewRealEstate(
            supply,
            "https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/1.json",
            price_wei,
            decimals
        ); 

        // Deploy Real Estate
        const RealEstate = await ethers.getContractFactory('RealEstate');
        address_rs_1 = await factory.RealEstateArray(0);
        //console.log(`Deployed RS 1 Contract at: ${address_rs_1}`)
        real_estate_1 = await RealEstate.attach(address_rs_1);

        //Data For Real Estate 
        max_supply_rs_1 = Number (await real_estate_1.maxSupply())
        total_supply_rs_1 = Number (await real_estate_1.totalSupply())

        // Deploy Escrow
        const Escrow = await ethers.getContractFactory('Escrow')
        escrow_rs_1 = await Escrow.deploy(
            address_rs_1,
            max_supply_rs_1,
            seller.address,
            inspector.address
        ) 
        //console.log(`Deployed Escrow Contract at: ${escrow_rs_1.address}`)


        // Pre Sale 
        for(var i = 1; i<=max_supply_rs_1 ; i++){
            let transaction = await real_estate_1.connect(creator).mint()
            await transaction.wait()
            transaction = await real_estate_1.connect(creator).approve(escrow_rs_1.address, i)
            await transaction.wait()
            transaction = await escrow_rs_1.connect(creator).preList(i)
            await transaction.wait()
        }
        

        // BUY THE FIRST HOUSE 
        let precio = Number(await real_estate_1.publicPrice())
        let decimals_price = Number( await real_estate_1.decimals())
        let real_price = (precio/decimals_price)
        transaction = await escrow_rs_1.connect(buyer).list(1, buyer.address, tokens(real_price) ) // tokens(precio) 
        await transaction.wait()
        transaction = await escrow_rs_1.connect(buyer).depositEarnest(1,{value: tokens(real_price)}) //tokens(precio) 
        await transaction.wait();

        
        // BUY THE SECOND HOUSE
        precio = Number(await real_estate_1.publicPrice())
        decimals_price = Number( await real_estate_1.decimals())
        real_price = (precio/decimals_price)
        transaction2 = await escrow_rs_1.connect(second_buyer).list(2, second_buyer.address, tokens(real_price))
        await transaction2.wait()
        transaction = await escrow_rs_1.connect(second_buyer).depositEarnest(2,{value: tokens(real_price)})
        await transaction.wait();
        

    })

    describe ('Deployment', () => {
        it("Deploy Factory", async() => {
            const result = await factory.RealEstateArray(0);
            expect(result).to.be.a('String')
        })

        it ("Total of RS in Factory", async() => { 
            expect(total_rs).to.equal(0)
        })

        it ("Number of Max Supply for the Real Estate", async() => {
            expect(max_supply_rs_1).to.equal(3)
        })

        it ("Number of Total Supply for the Real Estate", async () => {
            expect(total_supply_rs_1).to.equal(0)
        })

        it("Deploy Escrow", async() => {
            expect(escrow_rs_1).to.be.a('object')
        })

        it('Returns NFT address', async() => {
            const result = await escrow_rs_1.address_rs()  
            expect(result).to.be.equal(address_rs_1)
        })
        it('Returns seller', async() => {
            const result = await escrow_rs_1.seller()
            expect(result).to.be.equal(seller.address)
        })
    
        it('Returns inspector', async() => {
            const result = await escrow_rs_1.inspector()
            expect(result).to.be.equal(inspector.address)
        })

    })
    
    describe ('Listing', () => {
        it('Updates as listed',async () => {
            const result = await escrow_rs_1.isListed(1)
            expect(result).to.be.equal(true)
        })

        it('Updates as listed - Second NFT',async () => {
            const result = await escrow_rs_1.isListed(2)
            expect(result).to.be.equal(true)
        })

        it ('Updates ownership', async () => {
            expect(await real_estate_1.ownerOf(1)).to.be.equal(escrow_rs_1.address)
        })

        it ('Updates ownership - Second NFT', async () => {
            expect(await real_estate_1.ownerOf(2)).to.be.equal(escrow_rs_1.address)
        })

        it ('Returns buyer',async() => {
            const result = await escrow_rs_1.buyer(1)
            expect(result).to.be.equal(buyer.address)
        })

        it ('Returns buyer - Second NFT',async() => {
            const result = await escrow_rs_1.buyer(2)
            expect(result).to.be.equal(second_buyer.address)
        })

        it ('Returns purchase price',async() => {
            const result = await escrow_rs_1.purchasePrice(1)
            expect(result).to.be.equal(tokens(0.1))
        })

        it ('Returns purchase price - Second NFT',async() => {
            const result = await escrow_rs_1.purchasePrice(2)
            expect(result).to.be.equal(tokens(0.1))
        })

    })
    
    describe ('Deposits', () => {

        it ('Updates contract balances', async () => {
            const result = await escrow_rs_1.getBalance()
            expect(result).to.be.equal(tokens(0.2))
        })
    })

    describe ('Inspection', () => {

        it ('Updates inspection status', async () => {
            const transaction = await escrow_rs_1.connect(inspector).updateInspectionStatus(true)
            await transaction.wait()
            const result = await escrow_rs_1.inspectionPassed()
            expect(result).to.be.equal(true)
        })

        it ('Aproval inspection', async () => {
            let transaction = await escrow_rs_1.connect(buyer).approveSale(1)
            await transaction.wait()

            expect(await escrow_rs_1.approval(1,buyer.address)).to.be.equal(true)

        })

    })    

    describe ('Sale', () => {
        beforeEach(async () => {
            let precio = Number(await real_estate_1.publicPrice())
            let decimals_price = Number( await real_estate_1.decimals())
            let real_price = (precio/decimals_price)

            transaction = await escrow_rs_1.connect(buyer).list(3, buyer.address, tokens(real_price))
            await transaction.wait();

            transaction = await escrow_rs_1.connect(buyer).depositEarnest(3,{value: tokens(real_price)})
            await transaction.wait();
            
            transaction = await escrow_rs_1.connect(inspector).updateInspectionStatus(true)
            await transaction.wait()

            pre_Balance = await escrow_rs_1.getBalance();

            transaction = await escrow_rs_1.connect(inspector).finalizeSale(1)
            await transaction.wait()


        })

        it('Updates ownership', async () => {
            expect(await real_estate_1.ownerOf(1)).to.be.equal(buyer.address)
        })

        it('Updates ownership - Second NFT', async () => {
            expect(await real_estate_1.ownerOf(2)).to.be.equal(second_buyer.address)
        })
        it('Updates ownership - Third NFT', async () => {
            expect(await real_estate_1.ownerOf(3)).to.be.equal(buyer.address)
        })
        it('Updates balances', async () =>{
            expect( pre_Balance ).to.be.equal(tokens(0.3))
        })
    })
})