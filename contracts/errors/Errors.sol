// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library Errors {
    error InvalidAddress();
    error InvalidAmount();
    error InvalidInterval();
    error InsufficientBalance();
    error SubscriptionNotActive();
    error PaymentNotDue();
    error Unauthorized();
    error AlreadyExists();
    error NotFound();
    error Expired();
}

