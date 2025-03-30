// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title Constants
 * @notice Global constants used across contracts
 */
library Constants {
    uint256 constant MIN_INTERVAL = 1 days;
    uint256 constant MAX_INTERVAL = 365 days;
    uint256 constant MIN_AMOUNT = 1e6; // 1 USDC (6 decimals)
    uint256 constant PERCENTAGE_BASE = 100;
    uint256 constant DEFAULT_REFUND_WINDOW = 7 days;
}


