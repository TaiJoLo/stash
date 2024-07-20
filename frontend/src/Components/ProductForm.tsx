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
import { Location } from "../Models/Location";

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
  categories: Category[];
  parentProducts: ParentProduct[];
  locations: Location[]; // Add locations prop
}

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  onSave,
  product,
  categories,
  parentProducts,
  locations, // Add locations prop
}) => {
  const [name, setName] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [locationId, setLocationId] = useState<number>(0); // Change to locationId
  const [parentProductId, setParentProductId] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPictureUrl(product.pictureUrl || "");
      setCategoryId(product.categoryId || 0);
      setLocationId(product.locationId || 0); // Change to locationId
      setParentProductId(product.parentProductId || 0);
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setName("");
    setPictureUrl("");
    setCategoryId(0);
    setLocationId(0); // Change to locationId
    setParentProductId(0);
  };

  const handleSubmit = () => {
    if (!name || !categoryId || !locationId) {
      // Change to locationId
      alert("Please fill out all required fields");
      return;
    }

    const updatedProduct: Product = {
      id: product ? product.id : 0,
      name,
      pictureUrl,
      categoryId,
      locationId, // Change to locationId
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
          <InputLabel>Location</InputLabel>
          <Select
            value={locationId} // Change to locationId
            onChange={(e) => setLocationId(Number(e.target.value))} // Change to locationId
          >
            {locations.map((location) => (
              <MenuItem key={location.id} value={location.id}>
                {location.name}
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
