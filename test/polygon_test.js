// const { Network, Alchemy } = require("alchemy-sdk");

// // Optional Config object, but defaults to demo api-key and eth-mainnet.
// const settings = {
//   apiKey: "", // Replace with your Alchemy API Key.
//   network: Network.MATIC_MAINNET, // Replace with your network.
// };

// const alchemy = new Alchemy(settings);

// async function main() {
//   const latestBlock = await alchemy.core.getBlockNumber();
//   console.log("The latest block number is", latestBlock);
// }

// main();

// const { Polybase } = require ('@polybase/client');

// async function main(){
//     const dataBase_sc = new Polybase({
//         defaultNamespace: "pk/0x7fd09c2b6e44027ed2b6e478a5ff36e201317a6d4734e3ae4868827740ecf53265bff10a510904fc12fd98e277fb8af107f463425346ae359b19f25754bbf9fb/DOMO",
//       });
    
//     const collectionReference = dataBase_sc.collection("Tesnet5");
    
//     const records = await collectionReference.get("escrow_contract");
//     console.log(records)
//     console.log(records.data[0].data.escrow_contract)
// }


// main();



