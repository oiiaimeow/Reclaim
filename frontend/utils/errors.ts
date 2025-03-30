/**
 * Custom error class for contract interactions
 */
export class ContractError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ContractError';
  }
}

/**
 * Parse error from contract call
 */
export function parseContractError(error: unknown): string {
  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes('user rejected')) {
      return 'Transaction was rejected by user';
    }
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient funds for transaction';
    }
    if (error.message.includes('Invalid creator address')) {
      return 'Invalid creator address provided';
    }
    if (error.message.includes('Subscription is not active')) {
      return 'Subscription is no longer active';
    }
    if (error.message.includes('Payment not due yet')) {
      return 'Payment is not due yet';
    }
    if (error.message.includes('Only subscriber or creator can cancel')) {
      return 'Only subscriber or creator can cancel subscription';
    }
    if (error.message.includes('Refund window expired')) {
      return 'Refund window has expired';
    }
    if (error.message.includes('Insufficient balance')) {
      return 'Insufficient balance in vault';
    }

    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Error notification helper
 */
export function notifyError(error: unknown): void {
  const message = parseContractError(error);
  console.error('Error:', message, error);
  // In production, integrate with toast notification system
}

/**
 * Success notification helper
 */
export function notifySuccess(message: string): void {
  console.log('Success:', message);
  // In production, integrate with toast notification system
}


