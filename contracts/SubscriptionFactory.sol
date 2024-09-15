// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./PaymentManager.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SubscriptionFactory
 * @notice Factory contract for deploying new subscription payment managers
 * @dev Enables creators to deploy their own payment manager instances
 */
contract SubscriptionFactory is Ownable {
    // Array of all deployed payment managers
    address[] public deployedManagers;

    // Mapping from creator to their payment managers
    mapping(address => address[]) public creatorManagers;

    // Deployment fee
    uint256 public deploymentFee;

    // Protocol fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public protocolFeePercentage;

    // Events
    event ManagerDeployed(
        address indexed creator,
        address indexed manager,
        uint256 timestamp
    );

    event DeploymentFeeUpdated(uint256 newFee);
    event ProtocolFeeUpdated(uint256 newPercentage);

    constructor(uint256 _deploymentFee, uint256 _protocolFeePercentage)
        Ownable(msg.sender)
    {
        deploymentFee = _deploymentFee;
        protocolFeePercentage = _protocolFeePercentage;
    }

    /**
     * @notice Deploys a new payment manager for a creator
     * @return manager Address of the newly deployed payment manager
     */
    function deployPaymentManager() external payable returns (address manager) {
        require(msg.value >= deploymentFee, "Insufficient deployment fee");

        // Deploy new PaymentManager
        PaymentManager newManager = new PaymentManager();

        // Transfer ownership to creator
        newManager.transferOwnership(msg.sender);

        manager = address(newManager);

        // Store deployment info
        deployedManagers.push(manager);
        creatorManagers[msg.sender].push(manager);

        emit ManagerDeployed(msg.sender, manager, block.timestamp);

        // Refund excess payment
        if (msg.value > deploymentFee) {
            payable(msg.sender).transfer(msg.value - deploymentFee);
        }
    }

    /**
     * @notice Updates the deployment fee
     * @param newFee New deployment fee amount
     */
    function setDeploymentFee(uint256 newFee) external onlyOwner {
        deploymentFee = newFee;
        emit DeploymentFeeUpdated(newFee);
    }

    /**
     * @notice Updates the protocol fee percentage
     * @param newPercentage New protocol fee percentage
     */
    function setProtocolFeePercentage(uint256 newPercentage)
        external
        onlyOwner
    {
        require(newPercentage <= 1000, "Fee cannot exceed 10%");
        protocolFeePercentage = newPercentage;
        emit ProtocolFeeUpdated(newPercentage);
    }

    /**
     * @notice Gets all deployed managers
     * @return Array of manager addresses
     */
    function getAllManagers() external view returns (address[] memory) {
        return deployedManagers;
    }

    /**
     * @notice Gets managers deployed by a specific creator
     * @param creator Creator's address
     * @return Array of manager addresses
     */
    function getCreatorManagers(address creator)
        external
        view
        returns (address[] memory)
    {
        return creatorManagers[creator];
    }

    /**
     * @notice Gets total number of deployed managers
     * @return Total count
     */
    function getManagerCount() external view returns (uint256) {
        return deployedManagers.length;
    }

    /**
     * @notice Withdraws accumulated fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }
}

