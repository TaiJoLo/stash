import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";

interface StockTransaction {
  id: number;
  stockId: number;
  productName: string;
  amount: number;
  transactionTime: string;
  transactionType: string;
}

const ProductStockJournal: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log(`Fetching transactions for product ID: ${productId}`); // Debug log
        const response = await fetch(
          `http://localhost:5248/api/stocks/transactions/${productId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched transactions:", data); // Debug log
        console.log(
          "Response data type:",
          Array.isArray(data) ? "Array" : typeof data
        ); // Debug log

        // Check if the fetched data is in the expected format
        if (data && data.$values && Array.isArray(data.$values)) {
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
  }, [productId]);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Stock Journal for Product ID: {productId}
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Transaction Time</TableCell>
              <TableCell>Transaction Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
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

export default ProductStockJournal;
