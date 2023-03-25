require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { API_URL, PK_WALLET_PRINCIPAL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true
    },
    mumbai: {
      url: API_URL, 
      accounts: [`0x${PK_WALLET_PRINCIPAL}`],
      allowUnlimitedContractSize: true,
      gas: 2100000,
      gasPrice: 80000000000,
    },
  },
  solidity: "0.8.17",
};