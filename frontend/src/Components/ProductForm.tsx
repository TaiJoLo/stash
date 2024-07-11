import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  MenuItem,
  Grid,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface ParentProduct {
  id: number;
  name: string;
  inputValue?: string; // Add optional inputValue for custom options
}

interface Product {
  id: number;
  name: string;
  pictureUrl?: string;
  categoryId?: number;
  defaultLocation: string;
  parentProductId?: number;
}

const ProductForm: React.FC = () => {
  const [name, setName] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [category, setCategory] = useState("1");
  const [defaultLocation, setDefaultLocation] = useState("1");
  const [parentProducts, setParentProducts] = useState<ParentProduct[]>([]);
  const [selectedParentProduct, setSelectedParentProduct] =
    useState<ParentProduct | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newParentProductName, setNewParentProductName] = useState("");

  const locations = [
    { value: "1", label: "Location 1" },
    { value: "2", label: "Location 2" },
    { value: "3", label: "Location 3" },
  ];

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

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5248/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchParentProducts();
    fetchProducts();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const product = {
      name,
      pictureUrl,
      categoryId: parseInt(category),
      defaultLocation,
      parentProductId: selectedParentProduct ? selectedParentProduct.id : null,
    };

    console.log("Submitting product:", product);

    try {
      const response = await fetch("http://localhost:5248/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMessage("Product added successfully!");
      setError("");
      setProducts([...products, data]);
      console.log("Response:", data);
    } catch (error) {
      setMessage("");
      setError("Failed to add product. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleAddParentProduct = async () => {
    setOpenDialog(false);
    try {
      const response = await fetch("http://localhost:5248/api/parentproducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newParentProductName }),
      });

      if (!response.ok) {
        throw new Error("Failed to add parent product");
      }

      const newParentProduct = await response.json();
      setParentProducts((prev) => [...prev, newParentProduct]);
      setSelectedParentProduct(newParentProduct);
    } catch (error) {
      console.error("Error adding parent product:", error);
      setError("Failed to add parent product");
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "16px", marginTop: "16px" }}>
        <Typography variant="h6">Product Form</Typography>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="pictureUrl"
                name="pictureUrl"
                label="Picture URL"
                fullWidth
                value={pictureUrl}
                onChange={(e) => setPictureUrl(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="category"
                name="category"
                label="Category"
                select
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="1">Category 1</MenuItem>
                <MenuItem value="2">Category 2</MenuItem>
                <MenuItem value="3">Category 3</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="defaultLocation"
                name="defaultLocation"
                label="Default Location"
                select
                fullWidth
                value={defaultLocation}
                onChange={(e) => setDefaultLocation(e.target.value)}
              >
                {locations.map((location) => (
                  <MenuItem key={location.value} value={location.value}>
                    {location.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={parentProducts}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.name;
                }}
                value={selectedParentProduct}
                onChange={(_event, newValue) => {
                  if (typeof newValue === "string") {
                    setNewParentProductName(newValue);
                    setOpenDialog(true);
                  } else if (newValue && newValue.inputValue) {
                    setNewParentProductName(newValue.inputValue);
                    setOpenDialog(true);
                  } else {
                    setSelectedParentProduct(newValue);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = options.filter((option) =>
                    option.name
                      .toLowerCase()
                      .includes(params.inputValue.toLowerCase())
                  );

                  // Suggest the creation of a new value
                  if (params.inputValue !== "") {
                    filtered.push({
                      id: -1,
                      name: `Add "${params.inputValue}"`,
                      inputValue: params.inputValue,
                    });
                  }

                  return filtered;
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Parent Product" fullWidth />
                )}
                renderOption={(props, option) => (
                  <li
                    {...props}
                    key={option.id !== -1 ? option.id : option.inputValue}
                  >
                    {option.id === -1 ? <em>{option.name}</em> : option.name}
                  </li>
                )}
              />
            </Grid>
            <Grid item xs={12} style={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginRight: "8px" }}
              >
                Submit
              </Button>
              <Button variant="contained">Cancel</Button>
            </Grid>
          </Grid>
        </form>
        {message && (
          <Typography
            variant="body1"
            style={{ color: "green", marginTop: "16px" }}
          >
            {message}
          </Typography>
        )}
        {error && (
          <Typography
            variant="body1"
            style={{ color: "red", marginTop: "16px" }}
          >
            {error}
          </Typography>
        )}
      </Paper>
      <List>
        {products.map((product) => (
          <ListItem key={product.id}>
            <ListItemText
              primary={product.name}
              secondary={`Category: ${product.categoryId}, Picture URL: ${product.pictureUrl}, Default Location: ${product.defaultLocation}, Parent Product: ${product.parentProductId}`}
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Add Parent Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to add a new parent product: "{newParentProductName}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddParentProduct} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductForm;
