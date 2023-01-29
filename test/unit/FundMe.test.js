const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
// const {
//     isCallTrace
// } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const {developmentChain} = require("../../helper-hardhat.config")
!developmentChain.includes(network.name) ? describe.skip :
describe("FundMe", async () => {
    let fundMe, deployer, mockV3Aggregator
    const senValue = ethers.utils.parseEther("1")

    beforeEach(async () => {
        // const accounts = await ethers.getSigners()
        // const accountZero = accounts[0]
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })
    describe("constructor", async () => {
        it("sets the aggregator address correctly", async () => {
            const res = await fundMe.getPriceFeed()
            assert.equal(res, mockV3Aggregator.address)
        })
    })
    describe("fund", async () => {
        it("Fails if you don't send enough Eth", async () => {
            expect(fundMe.fund()).to.be.revertedWith(
                "Eth not enough to send"
            )
        })
        it("update the amount funded data structure", async () => {
            await fundMe.fund({ value: senValue })
            const res = await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(res.toString(), senValue.toString())
        })
        it("adds funder to array of funders", async () => {
            await fundMe.fund({ value: senValue })
            const funderAddress = await fundMe.getFunder(0)
            assert.equal(funderAddress, deployer)
        })
    })
    describe("withdraw", async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: senValue })
        })
        it("withdraw ETH from a single funder", async () => {
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            //find gas cost here
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )

            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })
        it("allows us to withdraw with multiple funders",async()=>{
            const accounts = await ethers.getSigners()
            for(let i =1;i<6;i++){
                const fundMeConnectedContract = await fundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({value: senValue})
            }
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            //find gas cost here
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)
            
            //assert
            await expect(fundMe.getFunder(0)).to.be.reverted

            for(i = 1;i>6;i++){
                assert.equal(await fundMe.addressToAmount(accounts[i].address),0)
            }

        })
        it("only allow the owner to withdraw " ,async()=>{
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker)
            expect(attackerConnectedContract.withdraw()).to.be.revertedWith("FundMe__NotOwner")
        })
        // it()
    })
})
