const {Polybase} = require('@polybase/client');
const { ethers } = require("hardhat");
const hre = require("hardhat");
const { NEXT_PUBLIC_NAME_ESPACE } = process.env;
require("dotenv").config();

let db = new Polybase({defaultNamespace: NEXT_PUBLIC_NAME_ESPACE,});
const collectionReference = db.collection("Tesnet01");

async function main() {
  // Setup accounts
  const seller = "0xF7E81CDD73c3C5309a9a346E365BdDC21CF67Df1"
  const inspector = "0x5281007dD0E66984A6E68e11039Fda8f038B5195"
  const supply = 6;
  const price = 0.1;
  
  let minting, transaction

  //Deploy Factory 
  const Factory = await hre.ethers.getContractFactory('Factory')
  const factory = await Factory.deploy()
  await factory.deployed()
  // 0x36db9F8383a73bEE62e3e10D121a7dC6a4Ac5A54 
  console.log(`Deployed Factory Contract at: ${factory.address} \n`)


//   const RealEstate = await hre.ethers.getContractFactory('RealEstate');
  const Escrow = await hre.ethers.getContractFactory('Escrow');


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
  //saveDB("1",address_rs_1,escrow_rs_1.address);

  const address_rs_2 = await factory.RealEstateArray(1);
  console.log(`Deployed RS 2 Contract at: ${address_rs_2}`);
  
  const escrow_rs_2 = await Escrow.deploy(address_rs_2,supply,seller.address,inspector.address);
  await escrow_rs_2.deployed();
  console.log(`Deployed Escrow Contract RS 2 at: ${escrow_rs_2.address}\n`);
  //saveDB("2",address_rs_2,escrow_rs_2.address)

  const address_rs_3 = await factory.RealEstateArray(2);
  console.log(`Deployed RS 3 Contract at: ${address_rs_3} `)
  
  const escrow_rs_3 = await Escrow.deploy(address_rs_3,supply,seller.address,inspector.address)
  await escrow_rs_3.deployed()
  console.log(`Deployed Escrow Contract RS 3 at: ${escrow_rs_3.address}\n`)
  //saveDB("3",address_rs_3,escrow_rs_3.address)
  
  console.log(`Finished.`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });