// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PaymentManager
 * @notice Manages subscription payments with automated recurring billing
 * @dev Implements ERC-4337 compatible subscription logic
 */
contract PaymentManager is Ownable, ReentrancyGuard {
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

    // Subscription ID counter
    uint256 private subscriptionIdCounter;

    // Mapping from subscription ID to Subscription
    mapping(uint256 => Subscription) public subscriptions;

    // Mapping from creator to their subscriber list
    mapping(address => uint256[]) public creatorSubscriptions;

    // Mapping from subscriber to their subscription list
    mapping(address => uint256[]) public subscriberSubscriptions;

    // Events
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

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Creates a new subscription
     * @param creator The address of the content creator
     * @param paymentToken The ERC20 token used for payment
     * @param amount The payment amount per interval
     * @param interval The payment interval in seconds
     * @return subscriptionId The ID of the newly created subscription
     */
    function createSubscription(
        address creator,
        address paymentToken,
        uint256 amount,
        uint256 interval
    ) external nonReentrant returns (uint256) {
        require(creator != address(0), "Invalid creator address");
        require(paymentToken != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        require(interval > 0, "Interval must be greater than 0");
        require(interval >= 1 days, "Interval must be at least 1 day");

        uint256 subscriptionId = subscriptionIdCounter++;

        subscriptions[subscriptionId] = Subscription({
            subscriber: msg.sender,
            creator: creator,
            paymentToken: paymentToken,
            amount: amount,
            interval: interval,
            nextPaymentDue: block.timestamp + interval,
            isActive: true,
            startTime: block.timestamp
        });

        creatorSubscriptions[creator].push(subscriptionId);
        subscriberSubscriptions[msg.sender].push(subscriptionId);

        // Process first payment immediately
        IERC20(paymentToken).transferFrom(msg.sender, creator, amount);

        emit SubscriptionCreated(
            subscriptionId,
            msg.sender,
            creator,
            paymentToken,
            amount,
            interval
        );

        emit PaymentProcessed(
            subscriptionId,
            msg.sender,
            creator,
            amount,
            block.timestamp
        );

        return subscriptionId;
    }

    /**
     * @notice Processes a recurring payment for an active subscription
     * @param subscriptionId The ID of the subscription
     */
    function processPayment(uint256 subscriptionId) external nonReentrant {
        Subscription storage sub = subscriptions[subscriptionId];

        require(sub.isActive, "Subscription is not active");
        require(block.timestamp >= sub.nextPaymentDue, "Payment not due yet");

        // Transfer payment from subscriber to creator
        IERC20(sub.paymentToken).transferFrom(
            sub.subscriber,
            sub.creator,
            sub.amount
        );

        // Update next payment due date
        sub.nextPaymentDue = block.timestamp + sub.interval;

        emit PaymentProcessed(
            subscriptionId,
            sub.subscriber,
            sub.creator,
            sub.amount,
            block.timestamp
        );
    }

    /**
     * @notice Cancels an active subscription
     * @param subscriptionId The ID of the subscription to cancel
     */
    function cancelSubscription(uint256 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];

        require(
            msg.sender == sub.subscriber || msg.sender == sub.creator,
            "Only subscriber or creator can cancel"
        );
        require(sub.isActive, "Subscription already cancelled");

        sub.isActive = false;

        emit SubscriptionCancelled(subscriptionId, sub.subscriber, block.timestamp);
    }

    /**
     * @notice Gets subscription details
     * @param subscriptionId The ID of the subscription
     */
    function getSubscription(uint256 subscriptionId)
        external
        view
        returns (Subscription memory)
    {
        return subscriptions[subscriptionId];
    }

    /**
     * @notice Gets all subscriptions for a creator
     * @param creator The creator's address
     */
    function getCreatorSubscriptions(address creator)
        external
        view
        returns (uint256[] memory)
    {
        return creatorSubscriptions[creator];
    }

    /**
     * @notice Gets all subscriptions for a subscriber
     * @param subscriber The subscriber's address
     */
    function getSubscriberSubscriptions(address subscriber)
        external
        view
        returns (uint256[] memory)
    {
        return subscriberSubscriptions[subscriber];
    }
}

