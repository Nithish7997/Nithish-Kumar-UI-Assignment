import React, { useEffect, useState, useMemo } from "react";
import { transactions } from "../../data/transactions";
import { calculateSummary } from "../../utils/calculateSummary";
import { debounce } from "../../utils/debounce";

/**
 * Displays customer reward points in a table format.
 */
const CustomerPoints = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debouncedChange = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearch(value.toLowerCase());
      }, 500),
    []
  );

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Simulate async API call
      const response = await new Promise((resolve) => {
        setTimeout(() => resolve(transactions), 1000);
      });
      setData(response);
      setSummary(calculateSummary(response));
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSummary = useMemo(() => {
    if (!debouncedSearch) return summary;

    return Object.fromEntries(
      Object.entries(summary).filter(([id, customer]) => {
        const matchNameOrId =
          customer.name.toLowerCase().includes(debouncedSearch) ||
          id.toLowerCase().includes(debouncedSearch);
        return matchNameOrId;
      })
    );
  }, [debouncedSearch, summary]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Customer Reward Points</h2>
      <input
        type="text"
        placeholder="Search by Customer Name or ID"
        onChange={(e) => {
          setSearch(e.target.value);
          debouncedChange(e.target.value);
        }}
        value={search}
      />

      {Object.keys(filteredSummary).length === 0 ? (
        <p>No matching records found.</p>
      ) : (
        Object.entries(filteredSummary).map(([id, customer]) => (
          <div key={id}>
            <h3>
              {customer.name} ({id})
            </h3>
            <table border="1" cellPadding="5" style={{ marginBottom: "20px" }}>
              <thead>
                <tr>
                  <th>Month-Year</th>
                  <th>Points Earned</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(customer.monthlyPoints).map(
                  ([month, points]) => (
                    <tr key={month}>
                      <td>{month}</td>
                      <td>{points}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <p>
              <strong>Total Points:</strong> {customer.totalPoints}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomerPoints;
