export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const diffInDays = (date1: Date, date2: Date): number => {
  const diff = date1.getTime() - date2.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const isExpired = (timestamp: number): boolean => {
  return Date.now() / 1000 > timestamp;
};

export default { addDays, addMonths, diffInDays, isExpired };

