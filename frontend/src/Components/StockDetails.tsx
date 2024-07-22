import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Edit as EditIcon,
  LocalGroceryStore as ConsumeIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import StockForm from "./StockForm";
import { Stock } from "../Models/Stock";
import { Location } from "../Models/Location";
import { Product } from "../Models/Product";
import { useNavigate } from "react-router-dom";

interface StockDetailsProps {
  stocks: Stock[];
  locations: Location[];
  products: Product[];
  onEdit: (stock: Stock) => void;
  onConsume: (stockId: number, amount: number) => void;
  onDelete: (stockId: number) => void;
}

type Order = "asc" | "desc";

const StockDetails: React.FC<StockDetailsProps> = ({
  stocks,
  locations,
  products,
  onEdit,
  onConsume,
  onDelete,
}) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Stock>("amount");
  const [editStock, setEditStock] = useState<Stock | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [consumeDialogOpen, setConsumeDialogOpen] = useState(false);
  const [consumeAmount, setConsumeAmount] = useState<number>(1);
  const [consumeAll, setConsumeAll] = useState<boolean>(false);
  const [consumeStock, setConsumeStock] = useState<Stock | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteStockId, setDeleteStockId] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleRequestSort = (property: keyof Stock) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedStocks = stocks
    .filter((stock) => stock.amount > 0) // Filter out stocks with amount 0
    .slice()
    .sort((a, b) => {
      if (orderBy === "dueDate" || orderBy === "purchaseDate") {
        const aValue = a[orderBy] ? new Date(a[orderBy]!).getTime() : 0;
        const bValue = b[orderBy] ? new Date(b[orderBy]!).getTime() : 0;
        return (aValue - bValue) * (order === "asc" ? 1 : -1);
      }
      if (orderBy === "locationId") {
        const aLocation =
          locations.find((loc) => loc.id === a.locationId)?.name || "";
        const bLocation =
          locations.find((loc) => loc.id === b.locationId)?.name || "";
        return aLocation.localeCompare(bLocation) * (order === "asc" ? 1 : -1);
      }
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      return (aValue - bValue) * (order === "asc" ? 1 : -1);
    });

  useEffect(() => {
    if (stocks.every((stock) => stock.amount === 0)) {
      navigate("/stock-overview");
    }
  }, [stocks, navigate]);

  const handleEditClick = (stock: Stock) => {
    setEditStock(stock);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditStock(null);
  };

  const handleFormSave = (stock: Stock) => {
    onEdit(stock);
    handleFormClose();
  };

  const handleConsumeClick = (stock: Stock) => {
    setConsumeStock(stock);
    setConsumeDialogOpen(true);
    setConsumeAmount(1); // Default consume amount
    setConsumeAll(false); // Default to not consuming all
  };

  const handleConsumeClose = () => {
    setConsumeDialogOpen(false);
    setConsumeAmount(1);
    setConsumeAll(false);
    setConsumeStock(null);
  };

  const handleConsumeSubmit = () => {
    if (consumeStock) {
      const amountToConsume = consumeAll ? consumeStock.amount : consumeAmount;
      onConsume(consumeStock.id, amountToConsume);
      handleConsumeClose();
      if (stocks.every((stock) => stock.amount === 0)) {
        navigate("/stock-overview");
      }
    }
  };

  const handleDeleteClick = (stockId: number) => {
    setDeleteStockId(stockId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteStockId) {
      onDelete(deleteStockId);
      setDeleteDialogOpen(false);
      setDeleteStockId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteStockId(null);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Stock Details
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "amount"}
                  direction={orderBy === "amount" ? order : "asc"}
                  onClick={() => handleRequestSort("amount")}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "unitPrice"}
                  direction={orderBy === "unitPrice" ? order : "asc"}
                  onClick={() => handleRequestSort("unitPrice")}
                >
                  Unit Price
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "dueDate"}
                  direction={orderBy === "dueDate" ? order : "asc"}
                  onClick={() => handleRequestSort("dueDate")}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "locationId"}
                  direction={orderBy === "locationId" ? order : "asc"}
                  onClick={() => handleRequestSort("locationId")}
                >
                  Location
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "purchaseDate"}
                  direction={orderBy === "purchaseDate" ? order : "asc"}
                  onClick={() => handleRequestSort("purchaseDate")}
                >
                  Purchase Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStocks.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>{stock.amount}</TableCell>
                <TableCell>{stock.unitPrice}</TableCell>
                <TableCell>{stock.dueDate?.substring(0, 10)}</TableCell>
                <TableCell>
                  {locations.find((loc) => loc.id === stock.locationId)?.name ||
                    ""}
                </TableCell>
                <TableCell>{stock.purchaseDate?.substring(0, 10)}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEditClick(stock)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="consume"
                    onClick={() => handleConsumeClick(stock)}
                  >
                    <ConsumeIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteClick(stock.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Stock Form */}
      <StockForm
        open={formOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
        stock={editStock}
        products={products}
        locations={locations}
      />

      {/* Consume Stock Dialog */}
      <Dialog open={consumeDialogOpen} onClose={handleConsumeClose}>
        <DialogTitle>Consume Stock</DialogTitle>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Stock?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this stock?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StockDetails;
