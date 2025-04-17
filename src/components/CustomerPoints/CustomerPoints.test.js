import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CustomerPoints from "./CustomerPoints";
import * as transactionService from "../../services/transactionService";

// Mock the fetchTransactions function
jest.mock("../../services/transactionService");

const mockTransactions = [
  {
    transactionId: "T001",
    customerId: "C001",
    customerName: "Alice",
    amount: 120.45,
    date: "2023-01-15",
  },
  {
    transactionId: "T002",
    customerId: "C002",
    customerName: "Bob",
    amount: 95.75,
    date: "2023-02-20",
  },
];

describe("CustomerPoints Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading initially and then data", async () => {
    transactionService.fetchTransactions.mockResolvedValue(mockTransactions);

    render(<CustomerPoints />);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  test("displays error message when fetch fails", async () => {
    transactionService.fetchTransactions.mockRejectedValue(
      new Error("Fetch error")
    );

    render(<CustomerPoints />);

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
    });
  });

  test("filters customers based on search input", async () => {
    transactionService.fetchTransactions.mockResolvedValue(mockTransactions);

    render(<CustomerPoints />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      /Search by Name \/ Customer ID \/ Transaction ID/i
    );
    fireEvent.change(searchInput, { target: { value: "Alice" } });

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    });
  });

  test("shows message when no matching customers found", async () => {
    transactionService.fetchTransactions.mockResolvedValue(mockTransactions);

    render(<CustomerPoints />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      /Search by Name \/ Customer ID \/ Transaction ID/i
    );
    fireEvent.change(searchInput, { target: { value: "ZZZ" } });

    await waitFor(() => {
      expect(screen.getByText(/No customers found./i)).toBeInTheDocument();
    });
  });
});
