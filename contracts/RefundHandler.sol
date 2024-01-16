// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RefundHandler
 * @notice Manages refund logic for cancelled subscriptions
 * @dev Calculates and processes refunds based on subscription terms
 */
contract RefundHandler is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct RefundPolicy {
        uint256 refundWindowDays; // Days within which refunds are allowed
        uint256 refundPercentage; // Percentage of refund (0-100)
        bool isActive;
    }

    struct RefundRequest {
        uint256 subscriptionId;
        address subscriber;
        address creator;
        address token;
        uint256 amount;
        uint256 requestTime;
        RefundStatus status;
    }

    enum RefundStatus {
        Pending,
        Approved,
        Rejected,
        Processed
    }

    // Refund request ID counter
    uint256 private refundRequestIdCounter;

    // Default refund policy
    RefundPolicy public defaultRefundPolicy;

    // Creator-specific refund policies
    mapping(address => RefundPolicy) public creatorRefundPolicies;

    // Refund requests
    mapping(uint256 => RefundRequest) public refundRequests;

    // Mapping from subscription ID to refund request ID
    mapping(uint256 => uint256) public subscriptionRefunds;

    // Events
    event RefundRequested(
        uint256 indexed refundId,
        uint256 indexed subscriptionId,
        address indexed subscriber,
        address creator,
        uint256 amount
    );

    event RefundProcessed(
        uint256 indexed refundId,
        uint256 indexed subscriptionId,
        address indexed subscriber,
        uint256 amount,
        RefundStatus status
    );

    event RefundPolicyUpdated(
        address indexed creator,
        uint256 refundWindowDays,
        uint256 refundPercentage
    );

    constructor() Ownable(msg.sender) {
        // Set default refund policy: 7 days, 100% refund
        defaultRefundPolicy = RefundPolicy({
            refundWindowDays: 7,
            refundPercentage: 100,
            isActive: true
        });
    }

    /**
     * @notice Updates the default refund policy
     * @param refundWindowDays Days within which refunds are allowed
     * @param refundPercentage Percentage of refund (0-100)
     */
    function setDefaultRefundPolicy(
        uint256 refundWindowDays,
        uint256 refundPercentage
    ) external onlyOwner {
        require(refundPercentage <= 100, "Percentage must be <= 100");

        defaultRefundPolicy = RefundPolicy({
            refundWindowDays: refundWindowDays,
            refundPercentage: refundPercentage,
            isActive: true
        });

        emit RefundPolicyUpdated(address(0), refundWindowDays, refundPercentage);
    }

    /**
     * @notice Allows creators to set their custom refund policy
     * @param refundWindowDays Days within which refunds are allowed
     * @param refundPercentage Percentage of refund (0-100)
     */
    function setCreatorRefundPolicy(
        uint256 refundWindowDays,
        uint256 refundPercentage
    ) external {
        require(refundPercentage <= 100, "Percentage must be <= 100");

        creatorRefundPolicies[msg.sender] = RefundPolicy({
            refundWindowDays: refundWindowDays,
            refundPercentage: refundPercentage,
            isActive: true
        });

        emit RefundPolicyUpdated(msg.sender, refundWindowDays, refundPercentage);
    }

    /**
     * @notice Requests a refund for a subscription
     * @param subscriptionId The subscription ID
     * @param subscriber The subscriber's address
     * @param creator The creator's address
     * @param token The payment token address
     * @param amount The subscription amount
     * @param subscriptionStartTime When the subscription started
     */
    function requestRefund(
        uint256 subscriptionId,
        address subscriber,
        address creator,
        address token,
        uint256 amount,
        uint256 subscriptionStartTime
    ) external nonReentrant returns (uint256) {
        require(subscriber == msg.sender, "Only subscriber can request refund");
        require(
            subscriptionRefunds[subscriptionId] == 0,
            "Refund already requested"
        );

        // Get applicable refund policy
        RefundPolicy memory policy = creatorRefundPolicies[creator].isActive
            ? creatorRefundPolicies[creator]
            : defaultRefundPolicy;

        // Check if within refund window
        require(
            block.timestamp <=
                subscriptionStartTime + (policy.refundWindowDays * 1 days),
            "Refund window expired"
        );

        uint256 refundId = refundRequestIdCounter++;

        // Calculate refund amount based on policy
        uint256 refundAmount = (amount * policy.refundPercentage) / 100;

        refundRequests[refundId] = RefundRequest({
            subscriptionId: subscriptionId,
            subscriber: subscriber,
            creator: creator,
            token: token,
            amount: refundAmount,
            requestTime: block.timestamp,
            status: RefundStatus.Pending
        });

        subscriptionRefunds[subscriptionId] = refundId;

        emit RefundRequested(
            refundId,
            subscriptionId,
            subscriber,
            creator,
            refundAmount
        );

        return refundId;
    }

    /**
     * @notice Processes a refund request (auto-approve or manual review)
     * @param refundId The refund request ID
     * @param approve True to approve, false to reject
     */
    function processRefund(uint256 refundId, bool approve) external nonReentrant {
        RefundRequest storage request = refundRequests[refundId];

        require(
            msg.sender == request.creator || msg.sender == owner(),
            "Not authorized"
        );
        require(request.status == RefundStatus.Pending, "Already processed");

        if (approve) {
            request.status = RefundStatus.Approved;
            // Transfer refund from creator to subscriber
            IERC20(request.token).safeTransferFrom(
                request.creator,
                request.subscriber,
                request.amount
            );
            request.status = RefundStatus.Processed;
        } else {
            request.status = RefundStatus.Rejected;
        }

        emit RefundProcessed(
            refundId,
            request.subscriptionId,
            request.subscriber,
            request.amount,
            request.status
        );
    }

    /**
     * @notice Gets refund policy for a creator
     * @param creator The creator's address
     */
    function getRefundPolicy(address creator)
        external
        view
        returns (RefundPolicy memory)
    {
        return
            creatorRefundPolicies[creator].isActive
                ? creatorRefundPolicies[creator]
                : defaultRefundPolicy;
    }

    /**
     * @notice Gets refund request details
     * @param refundId The refund request ID
     */
    function getRefundRequest(uint256 refundId)
        external
        view
        returns (RefundRequest memory)
    {
        return refundRequests[refundId];
    }

    /**
     * @notice Calculates refund amount based on policy
     * @param creator The creator's address
     * @param amount The original subscription amount
     */
    function calculateRefundAmount(address creator, uint256 amount)
        external
        view
        returns (uint256)
    {
        RefundPolicy memory policy = creatorRefundPolicies[creator].isActive
            ? creatorRefundPolicies[creator]
            : defaultRefundPolicy;

        return (amount * policy.refundPercentage) / 100;
    }
}

