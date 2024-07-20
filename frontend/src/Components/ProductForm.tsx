import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { Product } from "../Models/Product";
import { Category } from "../Models/Category";
import { ParentProduct } from "../Models/ParentProduct";

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
  categories: Category[];
  parentProducts: ParentProduct[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  onSave,
  product,
  categories,
  parentProducts,
}) => {
  const [name, setName] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [parentProductId, setParentProductId] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPictureUrl(product.pictureUrl || "");
      setCategoryId(product.categoryId || 0);
      setParentProductId(product.parentProductId || 0);
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setName("");
    setPictureUrl("");
    setCategoryId(0);
    setParentProductId(0);
  };

  const handleSubmit = () => {
    if (!name || !categoryId) {
      alert("Please fill out all required fields");
      return;
    }

    const updatedProduct: Product = {
      id: product ? product.id : 0,
      name,
      pictureUrl,
      categoryId,
      parentProductId,
    };

    onSave(updatedProduct);
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Picture URL"
          fullWidth
          value={pictureUrl}
          onChange={(e) => setPictureUrl(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
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
            value={parentProductId}
            onChange={(e) => setParentProductId(Number(e.target.value))}
          >
            {parentProducts.map((parentProduct) => (
              <MenuItem key={parentProduct.id} value={parentProduct.id}>
                {parentProduct.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default ProductForm;
