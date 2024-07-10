import React from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  MenuItem,
  Grid,
} from "@mui/material";

const ItemForm: React.FC = () => {
  const [name, setName] = React.useState("");
  const [pictureUrl, setPictureUrl] = React.useState("");
  const [category, setCategory] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "16px", marginTop: "16px" }}>
        <Typography variant="h6">Item Form</Typography>
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
                <MenuItem value="Category 1">Category 1</MenuItem>
                <MenuItem value="Category 2">Category 2</MenuItem>
                <MenuItem value="Category 3">Category 3</MenuItem>
              </TextField>
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

export default ItemForm;
