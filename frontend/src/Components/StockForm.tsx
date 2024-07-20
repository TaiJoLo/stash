import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Stock } from "../Models/Stock";
import { Product } from "../Models/Product";
import { Location } from "../Models/Location";

interface StockFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (stock: Stock) => void;
  stock: Stock | null;
  products: Product[];
  locations: Location[];
}

const StockForm: React.FC<StockFormProps> = ({
  open,
  onClose,
  onSave,
  stock,
  products,
  locations,
}) => {
  const [productId, setProductId] = useState<number | "">(
    stock?.productId || ""
  );
  const [locationId, setLocationId] = useState<number | "">(
    stock?.locationId || ""
  );
  const [amount, setAmount] = useState<number>(stock?.amount || 1); // Default to 1
  const [unitPrice, setUnitPrice] = useState<number>(stock?.unitPrice || 0); // Add unit price state
  const [purchaseDate, setPurchaseDate] = useState<string | null>(
    stock?.purchaseDate ? stock.purchaseDate.substring(0, 10) : null
  );
  const [dueDate, setDueDate] = useState<string | null>(
    stock?.dueDate ? stock.dueDate.substring(0, 10) : null
  );

  useEffect(() => {
    if (stock) {
      setProductId(stock.productId);
      setLocationId(stock.locationId);
      setAmount(stock.amount);
      setUnitPrice(stock.unitPrice); // Set unit price
      setPurchaseDate(
        stock.purchaseDate ? stock.purchaseDate.substring(0, 10) : null
      );
      setDueDate(stock.dueDate ? stock.dueDate.substring(0, 10) : null);
    } else {
      resetForm();
    }
  }, [stock]);

  const resetForm = () => {
    setProductId("");
    setLocationId("");
    setAmount(1);
    setUnitPrice(0); // Reset unit price
    setPurchaseDate(null);
    setDueDate(null);
  };

  const handleSubmit = () => {
    if (!productId || !locationId || amount < 1) {
      alert(
        "Please fill out all required fields and ensure amount is at least 1"
      );
      return;
    }

    const newStock: Stock = {
      id: stock ? stock.id : 0,
      productId: Number(productId),
      locationId: Number(locationId),
      amount,
      unitPrice, // Add unit price to new stock object
      purchaseDate: purchaseDate ? new Date(purchaseDate).toISOString() : null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    console.log("Saving stock:", newStock); // Log the stock data

    onSave(newStock);
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{stock ? "Edit Stock" : "Add Stock"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Product</InputLabel>
          <Select
            value={productId}
            onChange={(e) => setProductId(Number(e.target.value))}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Location</InputLabel>
          <Select
            value={locationId}
            onChange={(e) => setLocationId(Number(e.target.value))}
          >
            {locations.map((location) => (
              <MenuItem key={location.id} value={location.id}>
                {location.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Amount"
          fullWidth
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <TextField
          margin="dense"
          label="Unit Price"
          fullWidth
          type="number"
          value={unitPrice}
          onChange={(e) => setUnitPrice(Number(e.target.value))}
        />
        <TextField
          margin="dense"
          label="Purchase Date"
          fullWidth
          type="date"
          value={purchaseDate || ""}
          onChange={(e) => setPurchaseDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="dense"
          label="Due Date"
          fullWidth
          type="date"
          value={dueDate || ""}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockForm;
