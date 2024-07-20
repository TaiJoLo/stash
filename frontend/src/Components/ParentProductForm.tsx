import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { ParentProduct } from "../Models/ParentProduct";

interface ParentProductFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (parentProduct: ParentProduct) => void;
  parentProduct?: ParentProduct | null;
}

const ParentProductForm: React.FC<ParentProductFormProps> = ({
  open,
  onClose,
  onSave,
  parentProduct,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (parentProduct) {
      setName(parentProduct.name);
    } else {
      setName("");
    }
  }, [parentProduct]);

  const handleSave = () => {
    onSave({ id: parentProduct ? parentProduct.id : 0, name });
    setName(""); // Reset field after save
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {parentProduct ? "Edit Parent Product" : "Add New Parent Product"}
      </DialogTitle>
      <DialogContent style={{ marginTop: "20px" }}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Parent Product Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParentProductForm;
