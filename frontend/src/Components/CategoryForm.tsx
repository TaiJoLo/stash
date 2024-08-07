import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { Category } from "../Models/Category";

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  category?: Category | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onClose,
  onSave,
  category,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      resetForm();
    }
  }, [category]);

  const resetForm = () => {
    setName("");
  };

  const handleSave = () => {
    onSave({ id: category ? category.id : 0, name });
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {category ? "Edit Category" : "Add New Category"}
      </DialogTitle>
      <DialogContent style={{ marginTop: "20px" }}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Category Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryForm;
