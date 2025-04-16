import React, { useEffect, useState, useMemo } from "react";
import { fetchTransactions } from "../../api/transactionService";
import { calculatePoints } from "../../utils/rewardCalculator";
import useDebounce from "../../hooks/useDebounce";
import Loader from "../Loader/Loader";

/**
 * CustomerPoints Component
 * Displays reward points per customer grouped by month and total,
 * with support for search by customer name or ID, and detailed transaction info.
 */
function CustomerPoints() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.toLowerCase(), 300);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchTransactions();
        setData(response);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /**
   * Process transactions and calculate points grouped by customer and month.
   */
  const rewardsByCustomer = useMemo(() => {
    const summary = {};
    data.forEach(({ transactionId, customerId, name, date, amount }) => {
      const month = new Date(date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      const points = calculatePoints(amount);

      if (!summary[customerId]) {
        summary[customerId] = {
          name,
          customerId,
          monthly: {},
          total: 0,
        };
      }

      if (!summary[customerId].monthly[month]) {
        summary[customerId].monthly[month] = {
          points: 0,
          transactions: [],
        };
      }

      summary[customerId].monthly[month].points += points;
      summary[customerId].total += points;

      summary[customerId].monthly[month].transactions.push({
        transactionId,
        amount,
        date,
        points,
      });
    });
    // In debounce convert the entries pair of array back to object using fromEntries
    if (debouncedSearch) {
      return Object.fromEntries(
        Object.entries(summary).filter(
          ([id, customer]) =>
            customer.name.toLowerCase().includes(debouncedSearch) ||
            id.toLowerCase().includes(debouncedSearch)
        )
      );
    }

    return summary;
  }, [data, debouncedSearch]);

  if (loading) return <Loader />;

  return (
    <>
      <input
        type="text"
        placeholder="Search by name or customer ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px", width: "280px" }}
      />

      {Object.entries(rewardsByCustomer).map(([id, customer]) => (
        <div key={id} style={{ marginBottom: "25px" }}>
          <h3>
            {customer.name} ({customer.customerId})
          </h3>
          <ul>
            {Object.entries(customer.monthly).map(([month, monthData]) => (
              <li key={month}>
                <strong>
                  {month}: {monthData.points} points
                </strong>
                <ul>
                  {monthData.transactions.map((txn) => (
                    <li key={txn.transactionId}>
                      ID: {txn.transactionId} | Date:{" "}
                      {new Date(txn.date).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      | Amount: ${txn.amount} | Points: {txn.points}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li>
              <strong>Total: {customer.total} points</strong>
            </li>
          </ul>
        </div>
      ))}
    </>
  );
}

export default CustomerPoints;
