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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Product } from "../Models/Product";
import { ParentProduct } from "../Models/ParentProduct";
import { Category } from "../Models/Category";

interface HeadCell {
  id: keyof Product;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: "name", numeric: false, label: "Name" },
  { id: "categoryId", numeric: false, label: "Category" },
  { id: "defaultLocation", numeric: false, label: "Default Location" },
  { id: "parentProductId", numeric: false, label: "Parent Product" },
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

function getComparator<Key extends keyof Product>(
  order: Order,
  orderBy: Key
): (a: Product, b: Product) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentProducts, setParentProducts] = useState<ParentProduct[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Product>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await fetch(
          "http://localhost:5248/api/products"
        );
        const productsData = await productsResponse.json();
        setProducts(productsData);

        const categoriesResponse = await fetch(
          "http://localhost:5248/api/categories"
        );
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const parentProductsResponse = await fetch(
          "http://localhost:5248/api/parentproducts"
        );
        const parentProductsData = await parentProductsResponse.json();
        setParentProducts(parentProductsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown, MouseEvent>,
    property: keyof Product
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
    if (deleteProductId) {
      try {
        await fetch(`http://localhost:5248/api/products/${deleteProductId}`, {
          method: "DELETE",
        });

        const productsResponse = await fetch(
          "http://localhost:5248/api/products"
        );
        const updatedProductsData = await productsResponse.json();
        setProducts(updatedProductsData);

        setDeleteProductId(null);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEditClick = (product: Product) => {
    setEditProduct(product);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditProduct(null);
  };

  const handleEditSave = async () => {
    if (editProduct) {
      console.log("editProduct before PUT", editProduct);
      try {
        const response = await fetch(
          `http://localhost:5248/api/products/${editProduct.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editProduct),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          console.error("Error response text:", text);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const productsResponse = await fetch(
          "http://localhost:5248/api/products"
        );
        const updatedProductsData = await productsResponse.json();
        console.log("Updated products data:", updatedProductsData);
        setProducts(updatedProductsData);

        setEditDialogOpen(false);
        setEditProduct(null);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Products List
      </Typography>
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
              {products
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {categories.find((cat) => cat.id === product.categoryId)
                        ?.name || ""}
                    </TableCell>
                    <TableCell>{product.defaultLocation}</TableCell>
                    <TableCell>
                      {parentProducts.find(
                        (p) => p.id === product.parentProductId
                      )?.name || ""}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEditClick(product)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => setDeleteProductId(product.id)}
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
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteProductId} onClose={() => setDeleteProductId(null)}>
        <DialogTitle>Delete Product?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteProductId(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {editProduct && (
            <div>
              <TextField
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct((prev) => ({
                    ...prev!,
                    name: e.target.value,
                  }))
                }
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Category</InputLabel>
                <Select
                  value={
                    editProduct.categoryId !== undefined
                      ? editProduct.categoryId
                      : ""
                  }
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      categoryId: e.target.value as number,
                    })
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                label="Default Location"
                type="text"
                fullWidth
                value={editProduct.defaultLocation || ""}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    defaultLocation: e.target.value,
                  })
                }
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Parent Product</InputLabel>
                <Select
                  value={
                    editProduct.parentProductId !== undefined
                      ? editProduct.parentProductId
                      : ""
                  }
                  onChange={(e) => {
                    const selectedParentProductId = e.target.value as number;
                    const selectedParentProduct = parentProducts.find(
                      (p) => p.id === selectedParentProductId
                    );
                    console.log(
                      "Selected Parent Product:",
                      selectedParentProduct
                    );
                    setEditProduct({
                      ...editProduct,
                      parentProductId: selectedParentProductId,
                    });
                  }}
                >
                  {parentProducts.map((parentProduct) => (
                    <MenuItem key={parentProduct.id} value={parentProduct.id}>
                      {parentProduct.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (editProduct) {
                handleEditSave();
              }
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductList;
