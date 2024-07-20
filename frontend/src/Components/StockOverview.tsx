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
} from "@mui/material";
import { Product } from "../Models/Product";
import { Stock } from "../Models/Stock";
import { Location } from "../Models/Location";
import { Details as DetailsIcon } from "@mui/icons-material";
import StockDetails from "./StockDetails";

const StockOverview: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [groupedStocks, setGroupedStocks] = useState<Record<number, Stock[]>>(
    {}
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const productsResponse = await fetch(
        "http://localhost:5248/api/products"
      );
      const productsData = await productsResponse.json();
      setProducts(productsData);

      const stocksResponse = await fetch("http://localhost:5248/api/stocks");
      const stocksData = await stocksResponse.json();

      const locationsResponse = await fetch(
        "http://localhost:5248/api/locations"
      );
      const locationsData = await locationsResponse.json();
      setLocations(locationsData);

      const grouped = stocksData.reduce(
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
    };

    fetchData();
  }, []);

  const handleDetailsClick = (product: Product) => {
    setSelectedProduct(product);
    setDetailsDialogOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Stock Overview
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const productStocks = groupedStocks[product.id] || [];
              const totalAmount = productStocks.reduce(
                (sum, stock) => sum + stock.amount,
                0
              );
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{totalAmount}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDetailsClick(product)}>
                      <DetailsIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedProduct && (
        <Dialog open={detailsDialogOpen} onClose={handleDetailsClose}>
          <DialogTitle>{selectedProduct.name} </DialogTitle>
          <DialogContent>
            <StockDetails
              stocks={groupedStocks[selectedProduct.id]}
              locations={locations}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDetailsClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default StockOverview;
