// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title PaymentScheduler
 * @notice Utility contract for calculating payment schedules
 * @dev Provides helper functions for subscription payment timing
 */
library PaymentScheduler {
    uint256 constant SECONDS_PER_DAY = 86400;
    uint256 constant SECONDS_PER_WEEK = 604800;
    uint256 constant SECONDS_PER_MONTH = 2592000; // 30 days
    uint256 constant SECONDS_PER_YEAR = 31536000; // 365 days

    /**
     * @notice Calculates the next payment timestamp
     * @param lastPayment The last payment timestamp
     * @param interval The payment interval in seconds
     * @return The next payment timestamp
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
     * @param nextPaymentDue The next payment due timestamp
     * @return True if payment is due
     */
    function isPaymentDue(uint256 nextPaymentDue)
        internal
        view
        returns (bool)
    {
        return block.timestamp >= nextPaymentDue;
    }

    /**
     * @notice Calculates days until next payment
     * @param nextPaymentDue The next payment due timestamp
     * @return Days until payment (0 if overdue)
     */
    function daysUntilPayment(uint256 nextPaymentDue)
        internal
        view
        returns (uint256)
    {
        if (block.timestamp >= nextPaymentDue) {
            return 0;
        }
        return (nextPaymentDue - block.timestamp) / SECONDS_PER_DAY;
    }

    /**
     * @notice Calculates how many payments are overdue
     * @param nextPaymentDue The next payment due timestamp
     * @param interval The payment interval
     * @return Number of overdue payments
     */
    function overduePayments(uint256 nextPaymentDue, uint256 interval)
        internal
        view
        returns (uint256)
    {
        if (block.timestamp < nextPaymentDue) {
            return 0;
        }
        return (block.timestamp - nextPaymentDue) / interval + 1;
    }

    /**
     * @notice Calculates total payments in a time period
     * @param startTime The start timestamp
     * @param endTime The end timestamp
     * @param interval The payment interval
     * @return Total number of payments in the period
     */
    function paymentsInPeriod(
        uint256 startTime,
        uint256 endTime,
        uint256 interval
    ) internal pure returns (uint256) {
        if (endTime <= startTime) {
            return 0;
        }
        return (endTime - startTime) / interval;
    }

    /**
     * @notice Validates a payment interval
     * @param interval The interval to validate
     * @return True if interval is valid
     */
    function isValidInterval(uint256 interval) internal pure returns (bool) {
        return interval >= SECONDS_PER_DAY;
    }

    /**
     * @notice Gets standard interval for a period type
     * @param periodType 0=daily, 1=weekly, 2=monthly, 3=yearly
     * @return The interval in seconds
     */
    function getStandardInterval(uint8 periodType)
        internal
        pure
        returns (uint256)
    {
        if (periodType == 0) return SECONDS_PER_DAY;
        if (periodType == 1) return SECONDS_PER_WEEK;
        if (periodType == 2) return SECONDS_PER_MONTH;
        if (periodType == 3) return SECONDS_PER_YEAR;
        revert("Invalid period type");
    }

    /**
     * @notice Calculates pro-rated amount for partial period
     * @param fullAmount The full period amount
     * @param interval The full interval
     * @param actualTime The actual time elapsed
     * @return The pro-rated amount
     */
    function proRatedAmount(
        uint256 fullAmount,
        uint256 interval,
        uint256 actualTime
    ) internal pure returns (uint256) {
        if (actualTime >= interval) {
            return fullAmount;
        }
        return (fullAmount * actualTime) / interval;
    }

    /**
     * @notice Calculates the subscription end date
     * @param startTime The subscription start timestamp
     * @param numberOfPayments Number of payments
     * @param interval Payment interval
     * @return The end timestamp
     */
    function calculateEndDate(
        uint256 startTime,
        uint256 numberOfPayments,
        uint256 interval
    ) internal pure returns (uint256) {
        return startTime + (numberOfPayments * interval);
    }

    /**
     * @notice Checks if subscription period has ended
     * @param endTime The subscription end timestamp
     * @return True if ended
     */
    function hasEnded(uint256 endTime) internal view returns (bool) {
        return block.timestamp >= endTime;
    }

    /**
     * @notice Calculates remaining payments
     * @param nextPaymentDue Next payment timestamp
     * @param endTime Subscription end timestamp
     * @param interval Payment interval
     * @return Number of remaining payments
     */
    function remainingPayments(
        uint256 nextPaymentDue,
        uint256 endTime,
        uint256 interval
    ) internal pure returns (uint256) {
        if (nextPaymentDue >= endTime) {
            return 0;
        }
        return (endTime - nextPaymentDue) / interval + 1;
    }
}

