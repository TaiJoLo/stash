import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Container,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import StockForm from "./StockForm";
import { Stock } from "../Models/Stock";
import { Product } from "../Models/Product";
import { Location } from "../Models/Location";

interface HeadCell {
  id: keyof Stock;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: "productId", numeric: false, label: "Product" },
  { id: "locationId", numeric: false, label: "Location" },
  { id: "amount", numeric: true, label: "Amount" },
  { id: "purchaseDate", numeric: false, label: "Purchase Date" },
  { id: "dueDate", numeric: false, label: "Due Date" },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if ((b[orderBy] ?? "") < (a[orderBy] ?? "")) {
    return -1;
  }
  if ((b[orderBy] ?? "") > (a[orderBy] ?? "")) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof Stock>(
  order: Order,
  orderBy: Key
): (a: Stock, b: Stock) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Stock>("productId");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteStockId, setDeleteStockId] = useState<number | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editStock, setEditStock] = useState<Stock | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stocksResponse = await fetch("http://localhost:5248/api/stocks");
        const stocksData = await stocksResponse.json();
        setStocks(stocksData);

        const productsResponse = await fetch(
          "http://localhost:5248/api/products"
        );
        const productsData = await productsResponse.json();
        setProducts(productsData);

        const locationsResponse = await fetch(
          "http://localhost:5248/api/locations"
        );
        const locationsData = await locationsResponse.json();
        setLocations(locationsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Stock
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteConfirm = async () => {
    if (deleteStockId) {
      try {
        await fetch(`http://localhost:5248/api/stocks/${deleteStockId}`, {
          method: "DELETE",
        });

        const updatedStocks = stocks.filter((s) => s.id !== deleteStockId);
        setStocks(updatedStocks);

        setDeleteStockId(null);
      } catch (error) {
        console.error("Error deleting stock:", error);
      }
    }
  };

  const handleEditClick = (stock: Stock) => {
    setEditStock(stock);
    setFormOpen(true);
  };

  const handleFormOpen = () => {
    setFormOpen(true);
    setEditStock(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleFormSave = async (stock: Stock) => {
    const method = stock.id ? "PUT" : "POST";
    const url = stock.id
      ? `http://localhost:5248/api/stocks/${stock.id}`
      : "http://localhost:5248/api/stocks";

    try {
      console.log("Request data:", stock); // Log the request data
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stock),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Error response text:", text); // Log the error response text
        throw new Error("Network response was not ok");
      }

      const updatedStocks = await fetch(
        "http://localhost:5248/api/stocks"
      ).then((res) => res.json());
      setStocks(updatedStocks);
      handleFormClose();
    } catch (error) {
      console.error("Error saving stock:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Stocks List
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleFormOpen}
        style={{ marginBottom: "16px" }}
      >
        Add Stock
      </Button>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? "right" : "left"}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell>
                      {
                        products.find(
                          (product) => product.id === stock.productId
                        )?.name
                      }
                    </TableCell>
                    <TableCell>
                      {
                        locations.find(
                          (location) => location.id === stock.locationId
                        )?.name
                      }
                    </TableCell>
                    <TableCell>{stock.amount}</TableCell>
                    <TableCell>
                      {stock.purchaseDate
                        ? new Date(stock.purchaseDate).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>
                      {stock.dueDate
                        ? new Date(stock.dueDate).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEditClick(stock)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => setDeleteStockId(stock.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={stocks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteStockId} onClose={() => setDeleteStockId(null)}>
        <DialogTitle>Delete Stock?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this stock?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteStockId(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stock Form Dialog */}
      <StockForm
        open={formOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
        stock={editStock}
        products={products}
        locations={locations}
      />
    </Container>
  );
};

export default StockList;
