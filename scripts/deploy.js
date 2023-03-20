
const { ethers } = require("hardhat");
const hre = require("hardhat");
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts
  const [buyer, seller, inspector, lender] = await ethers.getSigners()
  let minting

  //Deploy Factory 
  const Factory = await ethers.getContractFactory('Factory')
  const factory = await Factory.deploy()
  await factory.deployed()
  console.log(`Deployed Factory Contract at: ${factory.address} \n`)


  const RealEstate = await ethers.getContractFactory('RealEstate');
  const Escrow = await ethers.getContractFactory('Escrow');

  // Mint Real Estate
  console.log("Minting 3 properties .... ")
  for (let i = 0; i < 3; i++) {
    minting = await factory.CreateNewRealEstate(
      2,
      `https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${i + 1}.json`
    )
  }

  const address_rs_1 = await factory.RealEstateArray(0);
  console.log(`Deployed RS 1 Contract at: ${address_rs_1}`);
  const escrow_rs_1 = await Escrow.deploy(address_rs_1,seller.address,inspector.address,lender.address);
  await escrow_rs_1.deployed();
  console.log(`Deployed Escrow Contract RS 1 at: ${escrow_rs_1.address}\n`);


  const address_rs_2 = await factory.RealEstateArray(1);
  console.log(`Deployed RS 2 Contract at: ${address_rs_2}`);
  const escrow_rs_2 = await Escrow.deploy(address_rs_2,seller.address,inspector.address,lender.address);
  await escrow_rs_2.deployed();
  console.log(`Deployed Escrow Contract RS 2 at: ${escrow_rs_2.address}\n`);

  const address_rs_3 = await factory.RealEstateArray(2);
  console.log(`Deployed RS 3 Contract at: ${address_rs_3} `)
  const escrow_rs_3 = await Escrow.deploy(address_rs_3,seller.address,inspector.address,lender.address)
  await escrow_rs_3.deployed()
  console.log(`Deployed Escrow Contract RS 3 at: ${escrow_rs_3.address}\n`)


  //console.log(`Listing Properties...`)
  // for (let i = 0; i < 2; i++) {
  //   // Approve properties...
  //   let transaction = await realEstate.connect(seller).approve(escrow.address, i + 1)
  //   await transaction.wait()
  // }

  // // Listing properties...
  // transaction = await escrow.connect(seller).list(1, buyer.address, tokens(20), tokens(10))
  // await transaction.wait()

  // transaction = await escrow.connect(seller).list(2, buyer.address, tokens(15), tokens(5))
  // await transaction.wait()

  // // transaction = await escrow.connect(seller).list(3, buyer.address, tokens(10), tokens(5))
  // // await transaction.wait()
  console.log(`Finished.`)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});