import { calculatePoints } from '../../utils/rewardCalculator';

test('calculatePoints correctly calculates reward', () => {
  expect(calculatePoints(120)).toBe(90);
  expect(calculatePoints(70)).toBe(20);
  expect(calculatePoints(30)).toBe(0);
});