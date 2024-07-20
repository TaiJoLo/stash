import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../Models/Product";
import { ParentProduct } from "../Models/ParentProduct";

interface ProductFormProps {
  onProductAdded?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded }) => {
  const [name, setName] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [category, setCategory] = useState<string | number>("");
  const [defaultLocation, setDefaultLocation] = useState("");
  const [parentProduct, setParentProduct] = useState<ParentProduct | null>(
    null
  );
  const [parentProducts, setParentProducts] = useState<ParentProduct[]>([]);
  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchParentProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5248/api/parentproducts"
        );
        const data: ParentProduct[] = await response.json();
        setParentProducts(data);
        console.log("Fetched parent products:", data); // Log fetched parent products
      } catch (error) {
        console.error("Error fetching parent products:", error);
      }
    };

    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await fetch(
            `http://localhost:5248/api/products/${id}`
          );
          const data: Product = await response.json();
          setName(data.name);
          setPictureUrl(data.pictureUrl || "");
          setCategory(data.categoryId || "");
          setDefaultLocation(data.defaultLocation);
          const selectedParentProduct = data.parentProductId
            ? parentProducts.find((pp) => pp.id === data.parentProductId) ||
              null
            : null;
          setParentProduct(selectedParentProduct);
          console.log("Fetched product:", data); // Log fetched product
          console.log("Selected parent product:", selectedParentProduct); // Log selected parent product
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };

    fetchParentProducts().then(fetchProduct);
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const product: Partial<Product> = {
      name,
      pictureUrl,
      categoryId: category ? parseInt(category as string) : undefined,
      defaultLocation,
      parentProductId: parentProduct?.id,
    };

    try {
      const response = await fetch(
        `http://localhost:5248/api/products${id ? `/${id}` : ""}`,
        {
          method: id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      if (response.ok) {
        if (onProductAdded) onProductAdded();
        navigate("/products");
      } else {
        console.error("Error saving product:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "16px", marginTop: "16px" }}>
        <Typography variant="h6">
          {id ? "Edit Product" : "Product Form"}
        </Typography>
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
                fullWidth
                value={defaultLocation}
                onChange={(e) => setDefaultLocation(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                id="parentProduct"
                value={parentProduct}
                onChange={(_event, newValue) => {
                  setParentProduct(newValue);
                  console.log("Selected new parent product:", newValue); // Log selected new parent product
                }}
                inputValue={inputValue}
                onInputChange={(_event, newInputValue) =>
                  setInputValue(newInputValue)
                }
                options={parentProducts}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.name
                }
                renderInput={(params) => (
                  <TextField {...params} label="Parent Product" fullWidth />
                )}
                freeSolo
                renderOption={(props, option) => (
                  <li {...props}>
                    {typeof option === "string" ? option : option.name}
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
              <Button variant="contained" onClick={() => navigate("/products")}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ProductForm;
