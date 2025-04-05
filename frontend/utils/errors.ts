export class Web3Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Web3Error';
  }
}

export class ContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContractError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export const parseError = (error: any): string => {
  if (error?.reason) return error.reason;
  if (error?.message) return error.message;
  return 'Unknown error occurred';
};

export default { Web3Error, ContractError, NetworkError, parseError };
