/**
 * Calculates the reward points summary for each customer.
 * @param {Array} transactions - List of transaction objects.
 * @returns {Object} summary - Points earned per month and total points.
 */
export const calculateSummary = (transactions) => {
  const summary = {};

  transactions.forEach(({ customerId, customerName, amount, date, transactionId }) => {
    const monthYear = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
    const roundedAmount = Math.floor(amount); // Ignore decimal part for points calculation

    let points = 0;
    if (roundedAmount > 100) {
      points += (roundedAmount - 100) * 2 + 50;
    } else if (roundedAmount > 50) {
      points += (roundedAmount - 50) * 1;
    }

    if (!summary[customerId]) {
      summary[customerId] = {
        name: customerName,
        monthlyPoints: {},
        totalPoints: 0,
      };
    }

    summary[customerId].monthlyPoints[monthYear] = (summary[customerId].monthlyPoints[monthYear] || 0) + points;
    summary[customerId].totalPoints += points;
  });

  return summary;
};
