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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import CategoryForm from "./CategoryForm";
import { Category } from "../Models/Category";

interface HeadCell {
  id: keyof Category;
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

function getComparator<Key extends keyof Category>(
  order: Order,
  orderBy: Key
): (a: Category, b: Category) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Category>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5248/api/categories");
      const data = await response.json();
      const categories = data.$values || data || [];
      console.log("Fetched categories:", categories); // Debug log
      setCategories(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered");
    fetchCategories();
  }, []);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown, MouseEvent>,
    property: keyof Category
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
    if (deleteCategoryId !== null) {
      try {
        await fetch(
          `http://localhost:5248/api/categories/${deleteCategoryId}`,
          {
            method: "DELETE",
          }
        );

        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== deleteCategoryId)
        );
        console.log("Category deleted:", deleteCategoryId); // Debug log
        setDeleteCategoryId(null);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleEditClick = (category: Category) => {
    setEditCategory(category);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditCategory(null);
  };

  const handleSave = async (category: Category) => {
    const method = category.id ? "PUT" : "POST";
    const url = category.id
      ? `http://localhost:5248/api/categories/${category.id}`
      : "http://localhost:5248/api/categories";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      const responseText = await response.text();
      console.log("Response Text:", responseText); // Debug log

      if (!response.ok) {
        console.error("Error response text:", responseText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!responseText) {
        console.error("Empty response text");
        throw new Error("Received empty response from the server");
      }

      const savedCategory = JSON.parse(responseText);
      console.log("Saved category:", savedCategory); // Debug log

      setCategories((prevCategories) => {
        if (method === "POST") {
          console.log("Adding new category to state:", savedCategory); // Debug log
          return [...prevCategories, savedCategory];
        } else {
          console.log("Updating existing category in state:", savedCategory); // Debug log
          return prevCategories.map((cat) =>
            cat.id === savedCategory.id ? savedCategory : cat
          );
        }
      });

      handleEditClose();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Categories
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => {
          setEditCategory(null);
          setEditDialogOpen(true);
        }}
        style={{ marginBottom: "16px" }}
      >
        Add Category
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
              {categories.length > 0 ? (
                categories
                  .sort(getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleEditClick(category)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => setDeleteCategoryId(category.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No categories available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteCategoryId}
        onClose={() => setDeleteCategoryId(null)}
      >
        <DialogTitle>Delete Category?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this category?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCategoryId(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Form Dialog */}
      <CategoryForm
        open={editDialogOpen}
        onClose={handleEditClose}
        onSave={handleSave}
        category={editCategory}
      />
    </Container>
  );
};

export default CategoryList;
