const { getNamedAccounts, ethers } = require('hardhat')

// notice => first on localhost node . 
// command => yarn hardhat node
// run this script command=> yarn hardhat run scripts/fund.js --network localhost

async function main() {
  const {deployer} = await getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe",deployer)
  console.log("funding contract....")
  const transactionResponse =await fundMe.fund({value: ethers.utils.parseEther("0.1")})
  await transactionResponse.wait(1)
  console.log("funded...")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
