// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ReclaimAccessControl
 * @notice Role-based access control for Reclaim protocol
 * @dev Extends OpenZeppelin AccessControl with custom roles
 */
contract ReclaimAccessControl is AccessControl {
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /**
     * @notice Constructor sets up initial roles
     * @param admin The initial admin address
     */
    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _setRoleAdmin(MANAGER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(OPERATOR_ROLE, ADMIN_ROLE);
        _setRoleAdmin(PAUSER_ROLE, ADMIN_ROLE);
    }

    /**
     * @notice Grants manager role to an address
     * @param account The address to grant the role to
     */
    function grantManagerRole(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(MANAGER_ROLE, account);
    }

    /**
     * @notice Revokes manager role from an address
     * @param account The address to revoke the role from
     */
    function revokeManagerRole(address account) external onlyRole(ADMIN_ROLE) {
        revokeRole(MANAGER_ROLE, account);
    }

    /**
     * @notice Grants operator role to an address
     * @param account The address to grant the role to
     */
    function grantOperatorRole(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(OPERATOR_ROLE, account);
    }

    /**
     * @notice Revokes operator role from an address
     * @param account The address to revoke the role from
     */
    function revokeOperatorRole(address account) external onlyRole(ADMIN_ROLE) {
        revokeRole(OPERATOR_ROLE, account);
    }

    /**
     * @notice Grants pauser role to an address
     * @param account The address to grant the role to
     */
    function grantPauserRole(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(PAUSER_ROLE, account);
    }

    /**
     * @notice Revokes pauser role from an address
     * @param account The address to revoke the role from
     */
    function revokePauserRole(address account) external onlyRole(ADMIN_ROLE) {
        revokeRole(PAUSER_ROLE, account);
    }

    /**
     * @notice Checks if an address has manager role
     * @param account The address to check
     * @return True if the address has manager role
     */
    function isManager(address account) external view returns (bool) {
        return hasRole(MANAGER_ROLE, account);
    }

    /**
     * @notice Checks if an address has operator role
     * @param account The address to check
     * @return True if the address has operator role
     */
    function isOperator(address account) external view returns (bool) {
        return hasRole(OPERATOR_ROLE, account);
    }

    /**
     * @notice Checks if an address has pauser role
     * @param account The address to check
     * @return True if the address has pauser role
     */
    function isPauser(address account) external view returns (bool) {
        return hasRole(PAUSER_ROLE, account);
    }

    /**
     * @notice Checks if an address has admin role
     * @param account The address to check
     * @return True if the address has admin role
     */
    function isAdmin(address account) external view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }
}

