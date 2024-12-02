# Frequently Asked Questions (FAQ)

## General Questions

### What is Reclaim?
Reclaim is a decentralized subscription payment platform built on Ethereum using ERC-4337 Account Abstraction. It enables automated recurring payments between subscribers and creators using cryptocurrency.

### How does it work?
Subscribers create subscriptions by approving tokens and setting payment intervals. Payments are processed automatically at each interval without requiring manual transactions.

### What blockchains are supported?
Currently supports Ethereum mainnet and Sepolia testnet. Plans to expand to Layer 2 networks (Optimism, Arbitrum) and other EVM-compatible chains.

### What tokens are supported?
Supports any ERC-20 token. Initially focusing on stablecoins (USDC, USDT, DAI) for price stability.

## For Subscribers

### How do I subscribe to a creator?
1. Connect your Web3 wallet
2. Enter creator's address
3. Choose subscription amount and frequency
4. Approve tokens
5. Confirm subscription

### Can I cancel anytime?
Yes, you can cancel your subscription at any time. No further payments will be processed after cancellation.

### What happens if I don't have enough balance?
The payment will fail. You'll need to add funds to your wallet for the next payment attempt.

### Can I get a refund?
Yes, within the refund window (default 7 days). The creator must approve the refund request.

### Are my funds safe?
Yes. All smart contracts are audited and use industry-standard security practices. You maintain full control of your funds.

## For Creators

### How do I start accepting subscriptions?
1. Deploy your payment manager (or use the default)
2. Share your wallet address with supporters
3. Set up your creator profile
4. Start receiving subscriptions!

### What fees do I pay?
- Platform fee: 2.5% of each payment
- Gas fees: Paid by subscribers
- Deployment fee: 0.01 ETH (one-time)

### How do I withdraw funds?
Funds are sent directly to your wallet address with each payment. No withdrawal needed.

### Can I set custom refund policies?
Yes, you can configure your own refund window and percentage.

### How do I track my subscribers?
Use the Creator Dashboard to view all subscribers, revenue, and analytics.

## Technical Questions

### What is ERC-4337?
ERC-4337 is an account abstraction standard that enables smart contract wallets and gasless transactions.

### Do I need ETH for gas?
Subscribers need ETH for the initial subscription creation and token approvals. Recurring payments can be automated.

### Is the code open source?
Yes! View our code on GitHub: https://github.com/oiiaimeow/Reclaim

### Has it been audited?
Security audit is planned. Current version is for testing and development.

### What if a payment fails?
The subscription remains active but marked as overdue. Payment can be retried once funds are available.

## Pricing & Fees

### How much does it cost?
- For subscribers: Token amount + gas fees
- For creators: 2.5% platform fee per payment
- Deployment: 0.01 ETH one-time

### Why are there gas fees?
Gas fees pay for Ethereum network transaction processing. We're working on gas optimization.

### Can I use fiat currency?
Not directly. You'll need to convert fiat to cryptocurrency first using an exchange or on-ramp service.

## Troubleshooting

### My transaction failed
Common causes:
- Insufficient gas
- Insufficient token balance
- Network congestion
- Incorrect approval amount

### I can't connect my wallet
Try:
- Refresh the page
- Check MetaMask is installed
- Switch to correct network
- Clear browser cache

### Payment isn't processing
Check:
- Subscription is active
- Payment date has arrived
- Wallet has sufficient balance
- Token approval is valid

### Creator isn't receiving funds
Verify:
- Correct creator address
- Smart contract is deployed
- Network matches expectations
- Check transaction on block explorer

## Security & Privacy

### Is my wallet at risk?
Only if you expose your private keys. Never share your seed phrase.

### What data is collected?
Only on-chain data (public blockchain data). No personal information is required.

### Can transactions be reversed?
No. Blockchain transactions are irreversible. Request refunds through the platform.

### What if I lose my wallet?
You'll lose access to your subscriptions and funds. Always backup your seed phrase securely.

## Future Features

### What's coming next?
- NFT-gated subscriptions
- Tiered subscription plans
- Discount codes and promotions
- Cross-chain support
- Fiat on-ramp integration
- Mobile app

### Can I request features?
Yes! Create a feature request on our GitHub repository.

### How can I contribute?
Check out CONTRIBUTING.md for contribution guidelines.

## Support

### How do I get help?
- Read documentation
- Join Discord community
- Open GitHub issue
- Email support team

### Where can I report bugs?
Report bugs on our GitHub repository or email security@reclaim.protocol

### Is there a community?
Yes! Join us on:
- Discord
- Twitter
- Telegram

## Legal & Compliance

### Is this legal?
Cryptocurrency regulations vary by jurisdiction. Consult local laws and tax advisors.

### Do I need to pay taxes?
Yes, in most jurisdictions. Cryptocurrency income is typically taxable. Consult a tax professional.

### What about KYC/AML?
Currently no KYC required for platform use. May change based on regulatory requirements.

### Terms of service?
View our terms at https://reclaim.protocol/terms

---

**Still have questions?**  
Contact us at support@reclaim.protocol or join our Discord community.
