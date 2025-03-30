// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title PaymentEvents
 * @notice Event definitions for payment-related actions
 */
library PaymentEvents {
    event SubscriptionCreated(
        uint256 indexed subscriptionId,
        address indexed subscriber,
        address indexed creator,
        address paymentToken,
        uint256 amount,
        uint256 interval
    );

    event PaymentProcessed(
        uint256 indexed subscriptionId,
        address indexed subscriber,
        address indexed creator,
        uint256 amount,
        uint256 timestamp
    );

    event SubscriptionCancelled(
        uint256 indexed subscriptionId,
        address indexed subscriber,
        uint256 timestamp
    );

    event SubscriptionPaused(
        uint256 indexed subscriptionId,
        address indexed subscriber,
        uint256 timestamp
    );

    event SubscriptionResumed(
        uint256 indexed subscriptionId,
        address indexed subscriber,
        uint256 timestamp
    );
}


