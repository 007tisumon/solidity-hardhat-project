const {networkConfig, developmentChain} = require("../helper-hardhat.config")
require('dotenv').config()
const {network} =require("hardhat")
const { verify } = require("../utils/verify")
 

module.exports = async({getNamedAccounts,deployments})=>{
    const {deploy ,log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
   
    if(developmentChain.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress=ethUsdAggregator.address
    }else{
         ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const fundMe = await deploy("FundMe",{
        from: deployer,
        args:[ethUsdPriceFeedAddress],
        log:true,
        waitConfirmations : network.config.blockConfirmation || 1
    })
    if(!developmentChain.includes(network.name) &&process.env.ETHERSCAN_API_KEY ){
        await verify(fundMe.address,[ethUsdPriceFeedAddress])
    }
    log("_______________________")
}

module.exports.tags =["all","fundme"]