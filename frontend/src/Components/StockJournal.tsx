import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography,
  TableSortLabel,
} from "@mui/material";

interface StockTransaction {
  id: number;
  stockId: number;
  productName: string;
  amount: number;
  transactionTime: string;
  transactionType: string;
}

type Order = "asc" | "desc";

const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T): number => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = <Key extends keyof StockTransaction>(
  order: Order,
  orderBy: Key
): ((a: StockTransaction, b: StockTransaction) => number) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const StockJournal: React.FC = () => {
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] =
    useState<keyof StockTransaction>("transactionTime");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5248/api/stocks/transactions`
        );
        console.log(`Fetching all transactions`); // Debug log
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched transactions:", data); // Debug log

        // Adjust for wrapped response data format
        if (data.$values) {
          setTransactions(data.$values);
        } else {
          throw new Error("Invalid response format for transactions data");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching transactions:", error);
          setError(error.message);
        } else {
          console.error("Unexpected error", error);
          setError("An unexpected error occurred");
        }
      }
    };

    fetchTransactions();
  }, []);

  const handleRequestSort = (property: keyof StockTransaction) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedTransactions = transactions.sort(getComparator(order, orderBy));

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Stock Journal
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sortDirection={orderBy === "productName" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "productName"}
                  direction={orderBy === "productName" ? order : "asc"}
                  onClick={() => handleRequestSort("productName")}
                >
                  Product
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "amount" ? order : false}>
                <TableSortLabel
                  active={orderBy === "amount"}
                  direction={orderBy === "amount" ? order : "asc"}
                  onClick={() => handleRequestSort("amount")}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={orderBy === "transactionTime" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "transactionTime"}
                  direction={orderBy === "transactionTime" ? order : "asc"}
                  onClick={() => handleRequestSort("transactionTime")}
                >
                  Transaction Time
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={orderBy === "transactionType" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "transactionType"}
                  direction={orderBy === "transactionType" ? order : "asc"}
                  onClick={() => handleRequestSort("transactionType")}
                >
                  Transaction Type
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.productName}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>
                  {new Date(transaction.transactionTime).toLocaleString()}
                </TableCell>
                <TableCell>{transaction.transactionType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default StockJournal;
