import transactions from '../data/transactions.json';

/**
 * Simulate an API call to get transaction data
 * @returns {Promise<Array>}
 */
export function fetchTransactions() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(transactions);
      } catch (error) {
        reject("Failed to fetch transactions");
      }
    }, 1000);
  });
}