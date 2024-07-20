import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import ParentProductForm from "./ParentProductForm";
import { ParentProduct } from "../Models/ParentProduct";

const ParentProductList: React.FC = () => {
  const [parentProducts, setParentProducts] = useState<ParentProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [editParentProduct, setEditParentProduct] =
    useState<ParentProduct | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchParentProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5248/api/parentproducts"
        );
        const data = await response.json();
        setParentProducts(data);
      } catch (error) {
        console.error("Error fetching parent products:", error);
      }
    };

    fetchParentProducts();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setEditParentProduct(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async (parentProduct: ParentProduct) => {
    try {
      const method = parentProduct.id ? "PUT" : "POST";
      const url = parentProduct.id
        ? `http://localhost:5248/api/parentproducts/${parentProduct.id}`
        : "http://localhost:5248/api/parentproducts";

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
      setParentProducts(updatedParentProducts);
      handleClose();
    } catch (error) {
      console.error("Error saving parent product:", error);
    }
  };

  const handleEdit = (parentProduct: ParentProduct) => {
    setEditParentProduct(parentProduct);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:5248/api/parentproducts/${id}`, {
        method: "DELETE",
      });

      const updatedParentProducts = await fetch(
        "http://localhost:5248/api/parentproducts"
      ).then((res) => res.json());
      setParentProducts(updatedParentProducts);
    } catch (error) {
      console.error("Error deleting parent product:", error);
    }
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

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Parent Products
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        style={{ marginBottom: "16px" }}
      >
        Add Parent Product
      </Button>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parentProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((parentProduct) => (
                  <TableRow key={parentProduct.id}>
                    <TableCell>{parentProduct.name}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEdit(parentProduct)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(parentProduct.id)}
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
          count={parentProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <ParentProductForm
        open={open}
        onClose={handleClose}
        onSave={handleSave}
        parentProduct={editParentProduct}
      />
    </Container>
  );
};

export default ParentProductList;
