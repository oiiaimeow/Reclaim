# Reclaim - 去中心化订阅支付系统

基于 ERC-4337 账户抽象的去中心化订阅支付平台，实现加密货币自动周期性支付。

## 特性

* 自动周期性支付
* 多币种支持
* 创作者控制台
* 灵活的订阅计划
* 退款机制
* Gas 优化

## 技术栈

* 智能合约: Solidity, Hardhat
* 前端: React, Next.js, TypeScript
* 钱包集成: ERC-4337 智能账户
* 区块链: Ethereum

## 快速开始

```bash
# 安装依赖
npm install

# 编译合约
npm run compile

# 运行测试
npm test

# 部署合约
npx hardhat run scripts/deploy-all.ts --network sepolia
```

## 文档

- [架构文档](./ARCHITECTURE.md)
- [API文档](./API.md)
- [部署指南](./DEPLOYMENT.md)
- [常见问题](./FAQ_zh.md)

## 许可证

MIT License

