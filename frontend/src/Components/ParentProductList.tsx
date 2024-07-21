import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  IconButton,
  Container,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import ParentProductForm from "./ParentProductForm";
import { ParentProduct } from "../Models/ParentProduct";

interface HeadCell {
  id: keyof ParentProduct;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [{ id: "name", numeric: false, label: "Name" }];

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

function getComparator<Key extends keyof ParentProduct>(
  order: Order,
  orderBy: Key
): (a: ParentProduct, b: ParentProduct) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const ParentProductList: React.FC = () => {
  const [parentProducts, setParentProducts] = useState<ParentProduct[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof ParentProduct>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteParentProductId, setDeleteParentProductId] = useState<
    number | null
  >(null);

  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editParentProduct, setEditParentProduct] =
    useState<ParentProduct | null>(null);

  const fetchParentProducts = async () => {
    try {
      const response = await fetch("http://localhost:5248/api/parentproducts");
      const data = await response.json();
      const parentProductsArray = Array.isArray(data)
        ? data
        : data.$values || [];
      console.log("Fetched parent products:", parentProductsArray); // Debug log
      setParentProducts(parentProductsArray);
    } catch (error) {
      console.error("Error fetching parent products:", error);
    }
  };

  useEffect(() => {
    fetchParentProducts();
  }, []);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown, MouseEvent>,
    property: keyof ParentProduct
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
    if (deleteParentProductId) {
      try {
        await fetch(
          `http://localhost:5248/api/parentproducts/${deleteParentProductId}`,
          {
            method: "DELETE",
          }
        );

        const response = await fetch(
          "http://localhost:5248/api/parentproducts"
        );
        const updatedParentProducts = await response.json();
        const parentProductsArray = Array.isArray(updatedParentProducts)
          ? updatedParentProducts
          : updatedParentProducts.$values || [];
        console.log(
          "Updated parent products after delete:",
          parentProductsArray
        ); // Debug log
        setParentProducts(parentProductsArray);

        setDeleteParentProductId(null);
      } catch (error) {
        console.error("Error deleting parent product:", error);
      }
    }
  };

  const handleEditClick = (parentProduct: ParentProduct) => {
    setEditParentProduct(parentProduct);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditParentProduct(null);
  };

  const handleSave = async (parentProduct: ParentProduct) => {
    const method = parentProduct.id ? "PUT" : "POST";
    const url = parentProduct.id
      ? `http://localhost:5248/api/parentproducts/${parentProduct.id}`
      : "http://localhost:5248/api/parentproducts";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parentProduct),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedParentProducts = await fetch(
        "http://localhost:5248/api/parentproducts"
      ).then((res) => res.json());
      const parentProductsArray = Array.isArray(updatedParentProducts)
        ? updatedParentProducts
        : updatedParentProducts.$values || [];
      console.log("Updated parent products:", parentProductsArray); // Debug log
      setParentProducts(parentProductsArray);
      handleEditClose();
    } catch (error) {
      console.error("Error saving parent product:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Parent Products
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setEditDialogOpen(true)}
        style={{ marginBottom: "16px" }}
      >
        Add Parent Product
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
              {Array.isArray(parentProducts) && parentProducts.length > 0 ? (
                parentProducts
                  .sort(getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((parentProduct) => (
                    <TableRow key={parentProduct.id}>
                      <TableCell>{parentProduct.name}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleEditClick(parentProduct)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() =>
                            setDeleteParentProductId(parentProduct.id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No parent products available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={Array.isArray(parentProducts) ? parentProducts.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteParentProductId !== null}
        onClose={() => setDeleteParentProductId(null)}
      >
        <DialogTitle>Delete Parent Product?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this parent product?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteParentProductId(null)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Parent Product Form Dialog */}
      <ParentProductForm
        open={editDialogOpen}
        onClose={handleEditClose}
        onSave={handleSave}
        parentProduct={editParentProduct}
      />
    </Container>
  );
};

export default ParentProductList;
