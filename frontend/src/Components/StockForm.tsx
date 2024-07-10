import React from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
} from "@mui/material";

const StockForm: React.FC = () => {
  const [name, setName] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [location, setLocation] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "16px", marginTop: "16px" }}>
        <Typography variant="h6">Stock Form</Typography>
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
                required
                id="quantity"
                name="quantity"
                label="Quantity"
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="location"
                name="location"
                label="Location"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
      </Paper>
    </Container>
  );
};

export default StockForm;
