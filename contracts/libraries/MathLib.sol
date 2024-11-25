// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title MathLib
 * @notice Mathematical utility functions for subscriptions
 */
library MathLib {
    /**
     * @notice Calculates percentage of an amount
     * @param amount The base amount
     * @param percentage The percentage in basis points (10000 = 100%)
     * @return The calculated amount
     */
    function percentageOf(uint256 amount, uint256 percentage)
        internal
        pure
        returns (uint256)
    {
        return (amount * percentage) / 10000;
    }

    /**
     * @notice Calculates compound interest
     * @param principal Principal amount
     * @param rate Interest rate in basis points
     * @param periods Number of periods
     * @return The final amount
     */
    function compoundInterest(
        uint256 principal,
        uint256 rate,
        uint256 periods
    ) internal pure returns (uint256) {
        uint256 amount = principal;
        for (uint256 i = 0; i < periods; i++) {
            amount = amount + percentageOf(amount, rate);
        }
        return amount;
    }

    /**
     * @notice Calculates average of array
     * @param values Array of values
     * @return The average
     */
    function average(uint256[] memory values)
        internal
        pure
        returns (uint256)
    {
        if (values.length == 0) return 0;
        uint256 sum = 0;
        for (uint256 i = 0; i < values.length; i++) {
            sum += values[i];
        }
        return sum / values.length;
    }

    /**
     * @notice Finds minimum value in array
     * @param values Array of values
     * @return The minimum value
     */
    function min(uint256[] memory values) internal pure returns (uint256) {
        require(values.length > 0, "Empty array");
        uint256 minValue = values[0];
        for (uint256 i = 1; i < values.length; i++) {
            if (values[i] < minValue) {
                minValue = values[i];
            }
        }
        return minValue;
    }

    /**
     * @notice Finds maximum value in array
     * @param values Array of values
     * @return The maximum value
     */
    function max(uint256[] memory values) internal pure returns (uint256) {
        require(values.length > 0, "Empty array");
        uint256 maxValue = values[0];
        for (uint256 i = 1; i < values.length; i++) {
            if (values[i] > maxValue) {
                maxValue = values[i];
            }
        }
        return maxValue;
    }
}

