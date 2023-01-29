require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers:[
      {version:"0.8.17"},{version:"0.6.6"}
    ]
  },
  defaultNetwork: "hardhat",
  networks:{
    goerli:{
      url: process.env.GOERLI_RPC_URL || '',
      accounts: [process.env.PRIVATE_KEY],
      chainId:5,
      blockConfirmation:6,
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    currency: "USD",
    noColors: true,
    token: "MATIC",
    // coinmarketcap:process.env.COINMARKETCAP_API_KEY
  },
  etherscan:{
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts:{
    deployer: {
      default: 0,
    },
    user: {
      default: 1
    }
  }
};
