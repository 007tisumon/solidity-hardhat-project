// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    // gorerli 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
        function getPrice(AggregatorV3Interface priceFeed) internal view returns(uint) {
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(priceFeed);
        (/* uint80 roundID */,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/) = priceFeed.latestRoundData();
        return uint(price * 1e10);
    }
    // function getVersion() internal view returns(uint) {
    //     AggregatorV3Interface priceFeed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
    //     return priceFeed.version();
    // }
    function getConversionRate(uint ethAmount,AggregatorV3Interface priceFeed) internal view returns(uint) {
        uint ethPrice = getPrice(priceFeed);
        uint ethAmountUsd = (ethPrice * ethAmount) / 1e18 ;
        return ethAmountUsd;
    }
}