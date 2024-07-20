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
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import ProductForm from "./ProductForm";
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
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await fetch(
          "http://localhost:5248/api/products"
        );
        const productsData = await productsResponse.json();
        console.log("Fetched Products: ", productsData);
        setProducts(productsData);

        const categoriesResponse = await fetch(
          "http://localhost:5248/api/categories"
        );
        const categoriesData = await categoriesResponse.json();
        console.log("Fetched Categories: ", categoriesData);
        setCategories(categoriesData);

        const parentProductsResponse = await fetch(
          "http://localhost:5248/api/parentproducts"
        );
        const parentProductsData = await parentProductsResponse.json();
        console.log("Fetched Parent Products: ", parentProductsData);
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

  const handleEditSave = async (product: Product) => {
    try {
      const response = await fetch(
        `http://localhost:5248/api/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
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
      setProducts(updatedProductsData);

      setEditDialogOpen(false);
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleFormOpen = () => {
    setFormOpen(true);
    setEditProduct(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleFormSave = async (product: Product) => {
    const method = product.id ? "PUT" : "POST";
    const url = product.id
      ? `http://localhost:5248/api/products/${product.id}`
      : "http://localhost:5248/api/products";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedProducts = await fetch(
        "http://localhost:5248/api/products"
      ).then((res) => res.json());
      setProducts(updatedProducts);
      handleFormClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Products List
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleFormOpen}
        style={{ marginBottom: "16px" }}
      >
        Add Product
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

      {/* Product Form Dialog */}
      <ProductForm
        open={formOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
        product={editProduct}
        categories={categories}
        parentProducts={parentProducts}
      />

      {/* Edit Product Dialog */}
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
                  value={editProduct.categoryId || ""}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      categoryId: Number(e.target.value),
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
              <FormControl fullWidth margin="dense">
                <InputLabel>Parent Product</InputLabel>
                <Select
                  value={editProduct.parentProductId || ""}
                  onChange={(e) => {
                    const selectedParentProductId = Number(e.target.value);
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
                handleEditSave(editProduct);
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
