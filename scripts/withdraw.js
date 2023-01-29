const { getNamedAccounts, ethers } = require('hardhat')

// notice => first on localhost node . 
// command => yarn hardhat node
// run this script command=> yarn hardhat run scripts/withdraw.js --network localhost

async function main() {
  const {deployer} = await getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe",deployer)
  console.log("funding contract....")
  const transactionResponse =await fundMe.withdraw()
  await transactionResponse.wait(1)
  console.log("fund got it")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
