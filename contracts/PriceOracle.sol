// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PriceOracle
 * @notice Price oracle for converting between different tokens
 * @dev Provides price feeds for subscription pricing
 */
contract PriceOracle is Ownable {
    // Token pair => price (in 18 decimals)
    mapping(bytes32 => uint256) public prices;

    // Token pair => last update timestamp
    mapping(bytes32 => uint256) public lastUpdated;

    // Price validity period (24 hours)
    uint256 public constant PRICE_VALIDITY_PERIOD = 24 hours;

    // Events
    event PriceUpdated(
        address indexed tokenA,
        address indexed tokenB,
        uint256 price,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Updates price for a token pair
     * @param tokenA First token address
     * @param tokenB Second token address
     * @param price Price in 18 decimals
     */
    function updatePrice(
        address tokenA,
        address tokenB,
        uint256 price
    ) external onlyOwner {
        require(tokenA != address(0) && tokenB != address(0), "Invalid token");
        require(price > 0, "Invalid price");

        bytes32 pairId = _getPairId(tokenA, tokenB);
        prices[pairId] = price;
        lastUpdated[pairId] = block.timestamp;

        emit PriceUpdated(tokenA, tokenB, price, block.timestamp);
    }

    /**
     * @notice Gets price for a token pair
     * @param tokenA First token address
     * @param tokenB Second token address
     * @return price The current price
     */
    function getPrice(address tokenA, address tokenB)
        external
        view
        returns (uint256 price)
    {
        bytes32 pairId = _getPairId(tokenA, tokenB);
        price = prices[pairId];
        require(price > 0, "Price not available");
        require(
            block.timestamp <= lastUpdated[pairId] + PRICE_VALIDITY_PERIOD,
            "Price expired"
        );
    }

    /**
     * @notice Converts amount from tokenA to tokenB
     * @param tokenA Source token
     * @param tokenB Target token
     * @param amountA Amount in tokenA
     * @return amountB Amount in tokenB
     */
    function convertAmount(
        address tokenA,
        address tokenB,
        uint256 amountA
    ) external view returns (uint256 amountB) {
        if (tokenA == tokenB) {
            return amountA;
        }

        bytes32 pairId = _getPairId(tokenA, tokenB);
        uint256 price = prices[pairId];
        require(price > 0, "Price not available");
        require(
            block.timestamp <= lastUpdated[pairId] + PRICE_VALIDITY_PERIOD,
            "Price expired"
        );

        amountB = (amountA * price) / 1e18;
    }

    /**
     * @notice Checks if price is valid
     * @param tokenA First token
     * @param tokenB Second token
     * @return True if price is valid and not expired
     */
    function isPriceValid(address tokenA, address tokenB)
        external
        view
        returns (bool)
    {
        bytes32 pairId = _getPairId(tokenA, tokenB);
        return
            prices[pairId] > 0 &&
            block.timestamp <= lastUpdated[pairId] + PRICE_VALIDITY_PERIOD;
    }

    /**
     * @notice Gets pair ID from two token addresses
     * @param tokenA First token
     * @param tokenB Second token
     * @return Unique pair identifier
     */
    function _getPairId(address tokenA, address tokenB)
        internal
        pure
        returns (bytes32)
    {
        return
            tokenA < tokenB
                ? keccak256(abi.encodePacked(tokenA, tokenB))
                : keccak256(abi.encodePacked(tokenB, tokenA));
    }
}

