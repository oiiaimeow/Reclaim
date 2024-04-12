// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title SubscriptionLib
 * @notice Library for subscription calculations and validations
 */
library SubscriptionLib {
    /**
     * @notice Calculates the next payment due date
     * @param lastPayment The timestamp of the last payment
     * @param interval The payment interval in seconds
     * @return The timestamp of the next payment
     */
    function calculateNextPayment(uint256 lastPayment, uint256 interval)
        internal
        pure
        returns (uint256)
    {
        return lastPayment + interval;
    }

    /**
     * @notice Checks if a payment is due
     * @param nextPaymentDue The timestamp when payment is due
     * @return True if payment is due, false otherwise
     */
    function isPaymentDue(uint256 nextPaymentDue) internal view returns (bool) {
        return block.timestamp >= nextPaymentDue;
    }

    /**
     * @notice Calculates the total payments made
     * @param startTime The subscription start time
     * @param interval The payment interval
     * @return The number of payments processed
     */
    function calculatePaymentCount(uint256 startTime, uint256 interval)
        internal
        view
        returns (uint256)
    {
        if (block.timestamp < startTime) return 0;
        uint256 elapsed = block.timestamp - startTime;
        return (elapsed / interval) + 1; // +1 for initial payment
    }

    /**
     * @notice Validates subscription parameters
     * @param creator The creator address
     * @param paymentToken The payment token address
     * @param amount The payment amount
     * @param interval The payment interval
     */
    function validateSubscriptionParams(
        address creator,
        address paymentToken,
        uint256 amount,
        uint256 interval
    ) internal pure {
        require(creator != address(0), "Invalid creator address");
        require(paymentToken != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        require(interval > 0, "Interval must be greater than 0");
        require(interval >= 1 days, "Interval must be at least 1 day");
    }

    /**
     * @notice Calculates pro-rated refund amount
     * @param amount The subscription amount
     * @param startTime The subscription start time
     * @param interval The payment interval
     * @return The refund amount
     */
    function calculateProRatedRefund(
        uint256 amount,
        uint256 startTime,
        uint256 interval
    ) internal view returns (uint256) {
        uint256 elapsed = block.timestamp - startTime;
        if (elapsed >= interval) return 0;

        uint256 remaining = interval - elapsed;
        return (amount * remaining) / interval;
    }
}

