# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project structure
- Core smart contracts (PaymentManager, SubscriptionVault, RefundHandler)
- Frontend application with Next.js
- Comprehensive test suite
- Documentation and guides

## [0.1.0] - 2024-06-25

### Added
- PaymentManager contract for subscription handling
- SubscriptionVault for secure fund management
- RefundHandler for cancellation and refunds
- MockUSDC test token
- React frontend with wallet integration
- Creator and user dashboards
- Deployment scripts
- CI/CD with GitHub Actions
- Comprehensive documentation

### Security
- ReentrancyGuard on all state-changing functions
- SafeERC20 for token transfers
- Access control with Ownable pattern
- Input validation on all user inputs

## [0.0.1] - 2024-01-15

### Added
- Project initialization
- Basic project structure
- License and README

[Unreleased]: https://github.com/oiiaimeow/Reclaim/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/oiiaimeow/Reclaim/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/oiiaimeow/Reclaim/releases/tag/v0.0.1

