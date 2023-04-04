const { ethPersonalSign } =  require('@polybase/eth');
const {Polybase} = require('@polybase/client');
const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config();
const { NEXT_PUBLIC_NAME_ESPACE } = process.env;
const NEXT_POLYBASE_NAME = process.env.NEXT_POLYBASE_NAME;

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

let db = new Polybase({defaultNamespace: NEXT_PUBLIC_NAME_ESPACE,});
const collectionReference = db.collection(NEXT_POLYBASE_NAME);
// db.signer((data) => {
//   return {
//     h: 'eth-personal-sign',
//     sig: ethPersonalSign("0x31773a22aa55fa1b25fb74dc39930e15104e83a256bfa119d8f1808ec923bd37"), data
//   }
// });



async function main() {
  // Setup accounts
  const [creator, seller, inspector, buyer, buyer_2] = await ethers.getSigners()
  const supply = 10;
  const price = 1;
  
  let minting, transaction

  //Deploy Factory 
  const Factory = await ethers.getContractFactory('Factory')
  const factory = await Factory.deploy()
  await factory.deployed()
  console.log(`Deployed Factory Contract at: ${factory.address} \n`)


  const RealEstate = await ethers.getContractFactory('RealEstate');
  const Escrow = await ethers.getContractFactory('Escrow');


  async function saveDB(id,real_estate_contract, escrow_contract  ){
    let res = await collectionReference.create([
      id,
      real_estate_contract, 
      escrow_contract
    ]);
  }

  // Create Real Estate
  console.log("Minting 3 properties .... ")
  for (let i = 0; i < 3; i++) {
    minting = await factory.CreateNewRealEstate(
      supply,
      `https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${i + 1}.json`,
      price
    )
  }


  const address_rs_1 = await factory.RealEstateArray(0);
  console.log(`Deployed RS 1 Contract at: ${address_rs_1}`);
  const escrow_rs_1 = await Escrow.deploy(address_rs_1,supply,seller.address,inspector.address);
  await escrow_rs_1.deployed();
  console.log(`Deployed Escrow Contract RS 1 at: ${escrow_rs_1.address}\n`);
  let real_estate_1 = await RealEstate.attach(address_rs_1);
  let max_supply_rs_1 = Number (await real_estate_1.maxSupply())
  saveDB("1",address_rs_1,escrow_rs_1.address);

  const address_rs_2 = await factory.RealEstateArray(1);
  console.log(`Deployed RS 2 Contract at: ${address_rs_2}`);
  const escrow_rs_2 = await Escrow.deploy(address_rs_2,supply,seller.address,inspector.address);
  await escrow_rs_2.deployed();
  console.log(`Deployed Escrow Contract RS 2 at: ${escrow_rs_2.address}\n`);
  let real_estate_2 = await RealEstate.attach(address_rs_2);
  let max_supply_rs_2 = Number (await real_estate_2.maxSupply())
  saveDB("2",address_rs_2,escrow_rs_2.address)

  const address_rs_3 = await factory.RealEstateArray(2);
  console.log(`Deployed RS 3 Contract at: ${address_rs_3} `)
  const escrow_rs_3 = await Escrow.deploy(address_rs_3,supply,seller.address,inspector.address)
  await escrow_rs_3.deployed()
  console.log(`Deployed Escrow Contract RS 3 at: ${escrow_rs_3.address}\n`)
  let real_estate_3 = await RealEstate.attach(address_rs_3);
  let max_supply_rs_3 = Number (await real_estate_3.maxSupply())
  saveDB("3",address_rs_3,escrow_rs_3.address)


  //Pre Sale RE_1
  for (let i = 1; i<= max_supply_rs_1; i++){
    transaction = await real_estate_1.connect(creator).mint();
    await transaction.wait();
    transaction = await real_estate_1.connect(creator).approve(escrow_rs_1.address, i)
    await transaction.wait();
    transaction = await escrow_rs_1.connect(creator).preList(i)
    await transaction.wait()
  }

  //Pre Sale RE_2
  for (let i = 1; i<= max_supply_rs_2; i++){
    transaction = await real_estate_2.connect(creator).mint();
    await transaction.wait();
    transaction = await real_estate_2.connect(creator).approve(escrow_rs_2.address, i)
    await transaction.wait();
    transaction = await escrow_rs_2.connect(creator).preList(i)
    await transaction.wait()
  }

  //Pre Sale RE_3
  for (let i = 1; i<= max_supply_rs_3; i++){
    transaction = await real_estate_3.connect(creator).mint();
    await transaction.wait();
    transaction = await real_estate_3.connect(creator).approve(escrow_rs_3.address, i)
    await transaction.wait();
    transaction = await escrow_rs_3.connect(creator).preList(i)
    await transaction.wait()

  }


  // Buy 100% - First proyect 
  for (let i = 1; i <= supply; i++) {
    
    let price = await real_estate_1.publicPrice()
    transaction = await escrow_rs_1.connect(buyer).list(i, buyer.address, tokens(price))
    await transaction.wait();
    transaction = await escrow_rs_1.connect(buyer).depositEarnest(i, {value:tokens(price) })
    await transaction.wait();
  }
  transaction = await escrow_rs_1.connect(inspector).updateInspectionStatus(true)
  await transaction.wait()
  //Aqui todavia tenemos que hacer finalizeSale. 
  
  // Buy 50% - First proyect

  for (let i = 1; i <= 5; i++) {
    let price2 = await real_estate_2.publicPrice();
    transaction = await escrow_rs_2.connect(buyer_2).list(i, buyer_2.address, tokens(price2))
    await transaction.wait()
    transaction = await escrow_rs_2.connect(buyer_2).depositEarnest(i, {value:tokens(price2) })
    await transaction.wait();
  }
  
  console.log(`Finished.`)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});