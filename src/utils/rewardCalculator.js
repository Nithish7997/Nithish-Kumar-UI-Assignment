/**
 * Calculate reward points based on the amount.
 * @param {number} amount - transaction amount
 * @returns {number} reward points
 */
export function calculatePoints(amount) {
  let points = 0;
  if (amount > 100) {
    points += (amount - 100) * 2;
    points += 50; // For $50-$100
  } else if (amount > 50) {
    points += (amount - 50) * 1;
  }
  return points;
}