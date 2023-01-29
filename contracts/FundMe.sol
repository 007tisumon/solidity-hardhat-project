// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;
import "./PriceConverter.sol";

error FundMe__NotOwner();

/**
 * @title A contract for crowd funding
 * @author DEV Sumon
 * @notice this contract is demo a simple funding contract 
 * @dev this implements price feeds our library
*/

contract FundMe {
    using PriceConverter for uint;
    // 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
    //storage variabele
    uint public constant minimumUSD = 50 * 10 ** 18;
    address private immutable owner;

    // event Funded(address indexed from, uint amount);

    address[] private fundersArray;
    mapping(address => uint) private addressToAmount;
   
    AggregatorV3Interface private priceFeed;

    modifier onlyOwner() {
        if (msg.sender != owner) revert FundMe__NotOwner();
        _;
    }

    constructor(address priceFeedAddress) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // receive() external payable {
    //     fund();
    // }

    // fallback() external payable {
    //     fund();
    // }

    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= minimumUSD,
            "Eth not enough to send"
        ); // 1e18 = 1 * 10 ** 18 = 1000000000000000000 wei
        addressToAmount[msg.sender] += msg.value;
        fundersArray.push(msg.sender);
    }

    function withdraw() public onlyOwner {
        for (
            uint funderIndex = 0;
            funderIndex > fundersArray.length;
            funderIndex++
        ) {
            address funder = fundersArray[funderIndex];
            addressToAmount[funder] = 0;
        }
        fundersArray = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess);
    }
    // function cheaperWithdraw() public onlyOwner {
    //     address[] memory funders = funders;
    //     // mappings can't be in memory, sorry!
    //     for (
    //         uint256 funderIndex = 0;
    //         funderIndex < funders.length;
    //         funderIndex++
    //     ) {
    //         address funder = funders[funderIndex];
    //         addressToAmount[funder] = 0;
    //     }
    //     funders = new address[](0);
    //     // payable(msg.sender).transfer(address(this).balance);
    //     (bool success, ) = owner.call{value: address(this).balance}("");
    //     require(success);
    // }

    // public view pure funtion declearation
    function getAddressToAmountFunded(address fundingAddress) public view returns(uint){
        return addressToAmount[fundingAddress];
    }
    function getFunder(uint index) public view returns(address){
        return fundersArray[index];
    }
    function getOwner() public view returns(address){
        return owner;
    }
    function getPriceFeed() public view returns(AggregatorV3Interface){
        return priceFeed;
    }


}
