# Frequently Asked Questions (FAQ)

## General

### What is Reclaim?

Reclaim is a decentralized subscription payment platform built on Ethereum using ERC-4337 Account Abstraction. It enables automated recurring payments between subscribers and content creators without intermediaries.

### How does it work?

Subscribers create a subscription by approving token spending and initiating a subscription contract. Payments are automatically processed at specified intervals using smart contracts.

### What tokens are supported?

Currently, we support major stablecoins including USDC, USDT, and DAI. More tokens may be added in the future.

## For Subscribers

### How do I subscribe to a creator?

1. Connect your Web3 wallet
2. Browse creators
3. Select a subscription plan
4. Approve token spending
5. Confirm the subscription

### Can I cancel anytime?

Yes, you can cancel your subscription at any time. Depending on the creator's refund policy, you may be eligible for a partial refund.

### How are payments processed?

Payments are automatically processed by smart contracts at the interval you selected (daily, weekly, monthly, etc.). Ensure you have sufficient balance in your wallet.

### What if I don't have enough balance?

If you don't have sufficient balance when a payment is due, the subscription will remain active but the payment will fail. You'll need to add funds and manually process the payment or cancel the subscription.

## For Creators

### How do I become a creator?

Simply connect your wallet and set up your creator profile. You can then set your subscription price and payment interval.

### How do I receive payments?

Payments are sent directly to your wallet address automatically when subscribers' payments are processed.

### Can I set a custom refund policy?

Yes, you can customize your refund window (in days) and refund percentage. Default is 7 days with 100% refund.

### How do I withdraw earnings?

Earnings are sent directly to your wallet. You don't need to withdraw - you have instant access to your funds.

## Technical

### What is ERC-4337?

ERC-4337 is an Account Abstraction standard that enables more flexible and user-friendly wallet interactions, including automated recurring payments.

### Is it secure?

Yes, the smart contracts use industry-standard security practices including ReentrancyGuard, SafeERC20, and access controls. We recommend conducting your own security review.

### Which networks are supported?

Currently:
- Ethereum Mainnet
- Sepolia Testnet
- More networks coming soon

### Are the contracts upgradeable?

Currently, the contracts are non-upgradeable to ensure immutability and security. Future versions may implement proxy patterns.

## Fees

### What are the fees?

You only pay Ethereum gas fees for transactions. There are no platform fees.

### How much are gas fees?

Gas fees vary based on network congestion. Typical costs:
- Create subscription: ~$5-15
- Process payment: ~$3-8
- Cancel subscription: ~$2-5

## Troubleshooting

### Transaction failed

Common causes:
- Insufficient gas
- Insufficient token balance
- Network congestion
- Try again with higher gas price

### Subscription not showing

- Wait for transaction confirmation
- Refresh the page
- Check transaction on block explorer
- Contact support if issue persists

### Payment not processed

- Ensure sufficient balance
- Check if subscription is still active
- Verify payment is due
- Try manually processing the payment

## Support

Still have questions? 

- Join our [Discord](https://discord.gg/reclaim)
- Email: support@reclaim.xyz
- Twitter: [@reclaim](https://twitter.com/reclaim)

