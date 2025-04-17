import { calculateSummary } from "../../utils/calculateSummary";

describe("calculateSummary", () => {
  it("should correctly calculate points for transactions", () => {
    const mockTransactions = [
      {
        transactionId: "T1",
        customerId: "C001",
        customerName: "Alice",
        amount: 120.75,
        date: "2025-01-15",
      },
      {
        transactionId: "T2",
        customerId: "C001",
        customerName: "Alice",
        amount: 80.0,
        date: "2025-01-20",
      },
    ];
    const result = calculateSummary(mockTransactions);
    expect(result["C001"].totalPoints).toBeGreaterThan(0);
    expect(Object.keys(result["C001"].monthlyPoints)).toContain("January 2025");
  });
});
