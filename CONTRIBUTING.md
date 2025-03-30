# Contributing to Reclaim

Thank you for your interest in contributing to Reclaim! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Reclaim.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit with a clear message
7. Push to your fork
8. Open a Pull Request

## Development Setup

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Run tests
npx hardhat test

# Start local blockchain
npx hardhat node

# Start frontend
cd frontend && npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Run `npm run lint` before committing
- Write meaningful commit messages

## Commit Message Format

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or updates
- `chore:` Build process or auxiliary tool changes

Examples:
```
feat: add subscription pause functionality
fix: resolve payment processing edge case
docs: update API documentation
```

## Pull Request Process

1. Update README.md with details of changes if needed
2. Update documentation
3. Ensure all tests pass
4. Request review from maintainers
5. Address review feedback
6. Once approved, your PR will be merged

## Testing Guidelines

- Write tests for new features
- Ensure existing tests pass
- Maintain or improve code coverage
- Test on local network before submitting

## Reporting Bugs

Use GitHub Issues to report bugs. Include:

- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

## Feature Requests

We welcome feature requests! Please:

- Check if the feature already exists
- Provide a clear use case
- Explain why it would benefit users
- Be open to discussion

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive criticism
- Collaborate openly

## Questions?

Feel free to open an issue or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.


