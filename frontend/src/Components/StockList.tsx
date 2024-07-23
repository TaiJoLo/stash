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
  id: keyof Stock | "productName" | "locationName";
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: "productName", numeric: false, label: "Product" },
  { id: "locationName", numeric: false, label: "Location" },
  { id: "amount", numeric: true, label: "Amount" },
  { id: "unitPrice", numeric: true, label: "Unit Price" },
  { id: "purchaseDate", numeric: false, label: "Purchase Date" },
  { id: "dueDate", numeric: false, label: "Due Date" },
];

type Order = "asc" | "desc";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if ((b[orderBy] ?? "") < (a[orderBy] ?? "")) {
    return -1;
  }
  if ((b[orderBy] ?? "") > (a[orderBy] ?? "")) {
    return 1;
  }
  return 0;
}

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<
    keyof Stock | "productName" | "locationName"
  >("productName");
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
        console.log("Fetched Stocks:", stocksData); // Debug log
        setStocks(
          Array.isArray(stocksData) ? stocksData : stocksData.$values || []
        );

        const productsResponse = await fetch(
          "http://localhost:5248/api/products"
        );
        const productsData = await productsResponse.json();
        console.log("Fetched Products:", productsData); // Debug log
        setProducts(
          Array.isArray(productsData)
            ? productsData
            : productsData.$values || []
        );

        const locationsResponse = await fetch(
          "http://localhost:5248/api/locations"
        );
        const locationsData = await locationsResponse.json();
        console.log("Fetched Locations:", locationsData); // Debug log
        setLocations(
          Array.isArray(locationsData)
            ? locationsData
            : locationsData.$values || []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Stock | "productName" | "locationName"
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
    if (deleteStockId !== null) {
      try {
        await fetch(`http://localhost:5248/api/stocks/${deleteStockId}`, {
          method: "DELETE",
        });

        setStocks((prevStocks) =>
          prevStocks.filter((stock) => stock.id !== deleteStockId)
        );
        console.log("Category deleted:", deleteStockId); // Debug log
        setDeleteStockId(null);
      } catch (error) {
        console.error("Error deleting category:", error);
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
      setStocks(
        Array.isArray(updatedStocks)
          ? updatedStocks
          : updatedStocks.$values || []
      );
      handleFormClose();
    } catch (error) {
      console.error("Error saving stock:", error);
    }
  };

  const sortedStocks = stocks.slice().sort((a, b) => {
    if (orderBy === "productName") {
      const productA =
        products.find((product) => product.id === a.productId)?.name || "";
      const productB =
        products.find((product) => product.id === b.productId)?.name || "";
      return productA.localeCompare(productB) * (order === "asc" ? 1 : -1);
    } else if (orderBy === "locationName") {
      const locationA =
        locations.find((location) => location.id === a.locationId)?.name || "";
      const locationB =
        locations.find((location) => location.id === b.locationId)?.name || "";
      return locationA.localeCompare(locationB) * (order === "asc" ? 1 : -1);
    } else {
      return (
        descendingComparator(a, b, orderBy as keyof Stock) *
        (order === "asc" ? 1 : -1)
      );
    }
  });

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
              {Array.isArray(sortedStocks) && sortedStocks.length > 0 ? (
                sortedStocks
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
                      <TableCell align="right">{stock.amount}</TableCell>
                      <TableCell align="right">{stock.unitPrice}</TableCell>
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
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No stocks available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={Array.isArray(stocks) ? stocks.length : 0}
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
