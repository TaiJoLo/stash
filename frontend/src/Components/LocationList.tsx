import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import LocationForm from "./LocationForm";
import { Location } from "../Models/Location";

const LocationList: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [open, setOpen] = useState(false);
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:5248/api/locations");
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setEditLocation(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async (location: Location) => {
    try {
      const method = location.id ? "PUT" : "POST";
      const url = location.id
        ? `http://localhost:5248/api/locations/${location.id}`
        : "http://localhost:5248/api/locations";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedLocations = await fetch(
        "http://localhost:5248/api/locations"
      ).then((res) => res.json());
      setLocations(updatedLocations);
      handleClose();
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const handleEdit = (location: Location) => {
    setEditLocation(location);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:5248/api/locations/${id}`, {
        method: "DELETE",
      });

      const updatedLocations = await fetch(
        "http://localhost:5248/api/locations"
      ).then((res) => res.json());
      setLocations(updatedLocations);
    } catch (error) {
      console.error("Error deleting location:", error);
    }
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

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Locations
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        style={{ marginBottom: "16px" }}
      >
        Add Location
      </Button>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>{location.name}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEdit(location)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(location.id)}
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
          count={locations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <LocationForm
        open={open}
        onClose={handleClose}
        onSave={handleSave}
        location={editLocation}
      />
    </Container>
  );
};

export default LocationList;
