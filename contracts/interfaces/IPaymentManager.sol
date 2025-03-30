// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title IPaymentManager
 * @notice Interface for the PaymentManager contract
 */
interface IPaymentManager {
    struct Subscription {
        address subscriber;
        address creator;
        address paymentToken;
        uint256 amount;
        uint256 interval;
        uint256 nextPaymentDue;
        bool isActive;
        uint256 startTime;
    }

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

    function createSubscription(
        address creator,
        address paymentToken,
        uint256 amount,
        uint256 interval
    ) external returns (uint256);

    function processPayment(uint256 subscriptionId) external;

    function cancelSubscription(uint256 subscriptionId) external;

    function getSubscription(uint256 subscriptionId)
        external
        view
        returns (Subscription memory);

    function getCreatorSubscriptions(address creator)
        external
        view
        returns (uint256[] memory);

    function getSubscriberSubscriptions(address subscriber)
        external
        view
        returns (uint256[] memory);
}


