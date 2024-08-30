// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title IRefundHandler
 * @notice Interface for RefundHandler contract
 * @dev Defines refund management methods
 */
interface IRefundHandler {
    enum RefundStatus {
        Pending,
        Approved,
        Rejected,
        Processed
    }

    struct RefundPolicy {
        uint256 refundWindowDays;
        uint256 refundPercentage;
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

    /**
     * @notice Updates the default refund policy
     * @param refundWindowDays Days within which refunds are allowed
     * @param refundPercentage Percentage of refund (0-100)
     */
    function setDefaultRefundPolicy(
        uint256 refundWindowDays,
        uint256 refundPercentage
    ) external;

    /**
     * @notice Allows creators to set their custom refund policy
     * @param refundWindowDays Days within which refunds are allowed
     * @param refundPercentage Percentage of refund (0-100)
     */
    function setCreatorRefundPolicy(
        uint256 refundWindowDays,
        uint256 refundPercentage
    ) external;

    /**
     * @notice Requests a refund for a subscription
     * @param subscriptionId The subscription ID
     * @param subscriber The subscriber's address
     * @param creator The creator's address
     * @param token The payment token address
     * @param amount The subscription amount
     * @param subscriptionStartTime When the subscription started
     * @return The refund request ID
     */
    function requestRefund(
        uint256 subscriptionId,
        address subscriber,
        address creator,
        address token,
        uint256 amount,
        uint256 subscriptionStartTime
    ) external returns (uint256);

    /**
     * @notice Processes a refund request
     * @param refundId The refund request ID
     * @param approve True to approve, false to reject
     */
    function processRefund(uint256 refundId, bool approve) external;

    /**
     * @notice Gets refund policy for a creator
     * @param creator The creator's address
     * @return The refund policy
     */
    function getRefundPolicy(address creator)
        external
        view
        returns (RefundPolicy memory);

    /**
     * @notice Gets refund request details
     * @param refundId The refund request ID
     * @return The refund request
     */
    function getRefundRequest(uint256 refundId)
        external
        view
        returns (RefundRequest memory);

    /**
     * @notice Calculates refund amount based on policy
     * @param creator The creator's address
     * @param amount The original subscription amount
     * @return The refund amount
     */
    function calculateRefundAmount(address creator, uint256 amount)
        external
        view
        returns (uint256);
}

