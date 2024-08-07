import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableSortLabel,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Product } from "../Models/Product";
import { Stock } from "../Models/Stock";
import { Location } from "../Models/Location";
import {
  Info as InfoIcon,
  LocalGroceryStore as ConsumeIcon,
  History as JournalIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StockDetails from "./StockDetails";

type Order = "asc" | "desc";

const StockOverview: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [groupedStocks, setGroupedStocks] = useState<Record<number, Stock[]>>(
    {}
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [consumeDialogOpen, setConsumeDialogOpen] = useState(false);
  const [consumeAmount, setConsumeAmount] = useState<number>(1);
  const [consumeAll, setConsumeAll] = useState<boolean>(false);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Product | "amount" | "value">(
    "name"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(
          "http://localhost:5248/api/products"
        );
        const productsData = await productsResponse.json();
        const productsArray = productsData.$values || productsData;
        setProducts(productsArray);

        const stocksResponse = await fetch("http://localhost:5248/api/stocks");
        const stocksData = await stocksResponse.json();
        const stocksArray = stocksData.$values || stocksData;

        const locationsResponse = await fetch(
          "http://localhost:5248/api/locations"
        );
        const locationsData = await locationsResponse.json();
        const locationsArray = locationsData.$values || locationsData;
        setLocations(locationsArray);

        const grouped = stocksArray.reduce(
          (acc: Record<number, Stock[]>, stock: Stock) => {
            if (!acc[stock.productId]) {
              acc[stock.productId] = [];
            }
            acc[stock.productId].push(stock);
            return acc;
          },
          {}
        );
        setGroupedStocks(grouped);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDetailsClick = (product: Product) => {
    setSelectedProduct(product);
    setDetailsDialogOpen(true);
  };

  const handleConsumeClick = (product: Product) => {
    setSelectedProduct(product);
    setConsumeDialogOpen(true);
    setConsumeAmount(1); // Default consume amount
    setConsumeAll(false); // Default to not consuming all
  };

  const handleDetailsClose = () => {
    setDetailsDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleConsumeClose = () => {
    setConsumeDialogOpen(false);
    setConsumeAmount(1);
    setConsumeAll(false);
  };

  const handleConsumeSubmit = async () => {
    if (selectedProduct && (consumeAmount > 0 || consumeAll)) {
      try {
        const amountToConsume = consumeAll
          ? groupedStocks[selectedProduct.id]?.reduce(
              (sum, stock) => sum + stock.amount,
              0
            ) || 0
          : consumeAmount;

        const response = await fetch(
          `http://localhost:5248/api/stocks/consume-stock-product/${selectedProduct.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(amountToConsume),
          }
        );

        if (response.ok) {
          alert("Stock consumed successfully.");
          handleConsumeClose();
          // Refresh stocks data
          const stocksResponse = await fetch(
            "http://localhost:5248/api/stocks"
          );
          const stocksData = await stocksResponse.json();
          const stocksArray = stocksData.$values || stocksData;

          const grouped = stocksArray.reduce(
            (acc: Record<number, Stock[]>, stock: Stock) => {
              if (!acc[stock.productId]) {
                acc[stock.productId] = [];
              }
              acc[stock.productId].push(stock);
              return acc;
            },
            {}
          );
          setGroupedStocks(grouped);
        } else {
          alert("Failed to consume stock.");
        }
      } catch (error) {
        console.error("Error consuming stock:", error);
        alert("Failed to consume stock.");
      }
    }
  };

  const handleEditStock = async (stock: Stock) => {
    try {
      const method = stock.id ? "PUT" : "POST";
      const url = stock.id
        ? `http://localhost:5248/api/stocks/${stock.id}`
        : "http://localhost:5248/api/stocks";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stock),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedStocks = await fetch(
        "http://localhost:5248/api/stocks"
      ).then((res) => res.json());
      const stocksArray = updatedStocks.$values || updatedStocks;
      const grouped = stocksArray.reduce(
        (acc: Record<number, Stock[]>, stock: Stock) => {
          if (!acc[stock.productId]) {
            acc[stock.productId] = [];
          }
          acc[stock.productId].push(stock);
          return acc;
        },
        {}
      );
      setGroupedStocks(grouped);
    } catch (error) {
      console.error("Error saving stock:", error);
    }
  };

  const handleDeleteStock = async (stockId: number) => {
    try {
      await fetch(`http://localhost:5248/api/stocks/${stockId}`, {
        method: "DELETE",
      });

      const updatedStocks = Object.values(groupedStocks)
        .flat()
        .filter((stock) => stock.id !== stockId);
      const grouped = updatedStocks.reduce(
        (acc: Record<number, Stock[]>, stock: Stock) => {
          if (!acc[stock.productId]) {
            acc[stock.productId] = [];
          }
          acc[stock.productId].push(stock);
          return acc;
        },
        {}
      );
      setGroupedStocks(grouped);
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  const handleConsumeStockEntry = async (stockId: number, amount: number) => {
    try {
      const response = await fetch(
        `http://localhost:5248/api/stocks/consume-stock-entry/${stockId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(amount),
        }
      );

      if (response.ok) {
        alert("Stock entry consumed successfully.");
        // Refresh stocks data
        const stocksResponse = await fetch("http://localhost:5248/api/stocks");
        const stocksData = await stocksResponse.json();
        const stocksArray = stocksData.$values || stocksData;

        const grouped = stocksArray.reduce(
          (acc: Record<number, Stock[]>, stock: Stock) => {
            if (!acc[stock.productId]) {
              acc[stock.productId] = [];
            }
            acc[stock.productId].push(stock);
            return acc;
          },
          {}
        );
        setGroupedStocks(grouped);
      } else {
        alert("Failed to consume stock entry.");
      }
    } catch (error) {
      console.error("Error consuming stock entry:", error);
      alert("Failed to consume stock entry.");
    }
  };

  const handleRequestSort = (property: keyof Product | "amount" | "value") => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedProducts = Array.isArray(products)
    ? products
        .slice()
        .sort((a, b) => {
          if (orderBy === "name") {
            return (
              (a[orderBy] as string).localeCompare(b[orderBy] as string) *
              (order === "asc" ? 1 : -1)
            );
          } else if (orderBy === "amount") {
            const aAmount =
              groupedStocks[a.id]?.reduce(
                (sum, stock) => sum + stock.amount,
                0
              ) || 0;
            const bAmount =
              groupedStocks[b.id]?.reduce(
                (sum, stock) => sum + stock.amount,
                0
              ) || 0;
            return (aAmount - bAmount) * (order === "asc" ? 1 : -1);
          } else {
            const aValue =
              groupedStocks[a.id]?.reduce(
                (sum, stock) => sum + stock.amount * stock.unitPrice,
                0
              ) || 0;
            const bValue =
              groupedStocks[b.id]?.reduce(
                (sum, stock) => sum + stock.amount * stock.unitPrice,
                0
              ) || 0;
            return (aValue - bValue) * (order === "asc" ? 1 : -1);
          }
        })
        .filter(
          (product) =>
            groupedStocks[product.id]?.reduce(
              (sum, stock) => sum + stock.amount,
              0
            ) > 0
        )
    : [];

  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Stock Overview
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleRequestSort("name")}
                >
                  Product
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "amount"}
                  direction={orderBy === "amount" ? order : "asc"}
                  onClick={() => handleRequestSort("amount")}
                >
                  Total Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "value"}
                  direction={orderBy === "value" ? order : "asc"}
                  onClick={() => handleRequestSort("value")}
                >
                  Total Value
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProducts.map((product) => {
              const productStocks = groupedStocks[product.id] || [];
              const totalAmount = productStocks.reduce(
                (sum, stock) => sum + stock.amount,
                0
              );
              const totalValue = productStocks.reduce(
                (sum, stock) => sum + stock.amount * stock.unitPrice,
                0
              );
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{totalAmount}</TableCell>
                  <TableCell>{totalValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDetailsClick(product)}>
                      <InfoIcon />
                    </IconButton>
                    <IconButton onClick={() => handleConsumeClick(product)}>
                      <ConsumeIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/stock-journal/${product.id}`)}
                    >
                      <JournalIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedProduct && (
        <>
          <Dialog open={detailsDialogOpen} onClose={handleDetailsClose}>
            <DialogTitle>{selectedProduct.name}</DialogTitle>
            <DialogContent>
              <StockDetails
                stocks={groupedStocks[selectedProduct.id]}
                locations={locations}
                products={products}
                onEdit={handleEditStock}
                onConsume={handleConsumeStockEntry}
                onDelete={handleDeleteStock}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDetailsClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={consumeDialogOpen} onClose={handleConsumeClose}>
            <DialogTitle>Consume Stock - {selectedProduct.name}</DialogTitle>
            <DialogContent>
              <TextField
                label="Amount to Consume"
                type="number"
                fullWidth
                value={consumeAmount}
                onChange={(e) => setConsumeAmount(Number(e.target.value))}
                inputProps={{ min: 1 }}
                margin="normal"
                disabled={consumeAll}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consumeAll}
                    onChange={(e) => setConsumeAll(e.target.checked)}
                  />
                }
                label="Consume All"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConsumeClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConsumeSubmit} color="primary">
                Consume
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default StockOverview;
