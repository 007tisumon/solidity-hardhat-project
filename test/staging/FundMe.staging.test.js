const { assert } = require('chai')
const {ethers,network,getNamedAccounts} = require('hardhat')
const {developmentChain} = require("../../helper-hardhat.config")


// note run this test
//yarn/npx hardhat test --network goerli

developmentChain.includes(network.name) ? describe.skip : describe("FundMe",async()=>{
    let fundMe, deployer
    const sendValue = ethers.utils.parseEther("0.1")
    beforeEach(async()=>{
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe",deployer)
    })
    it("allows people to fund and withdraw",async()=>{
        await fundMe.fund({value: sendValue})
        await fundMe.withdraw()
        const endingBalance= await fundMe.provider.getBalance(fundMe.address)
        assert.equal(endingBalance.toString(),"0")
    })
})

