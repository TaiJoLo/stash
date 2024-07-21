import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  IconButton,
  Container,
  Typography,
  Paper,
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
import LocationForm from "./LocationForm";
import { Location } from "../Models/Location";

interface HeadCell {
  id: keyof Location;
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

function getComparator<Key extends keyof Location>(
  order: Order,
  orderBy: Key
): (a: Location, b: Location) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const LocationList: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [open, setOpen] = useState(false);
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [deleteLocationId, setDeleteLocationId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Location>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:5248/api/locations");
      const data = await response.json();
      const locationsArray = Array.isArray(data) ? data : data.$values || [];
      console.log("Fetched locations:", locationsArray); // Debug log
      setLocations(locationsArray);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered");
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
      const locationsArray = Array.isArray(updatedLocations)
        ? updatedLocations
        : updatedLocations.$values || [];
      console.log("Updated locations:", locationsArray); // Debug log
      setLocations(locationsArray);
      handleClose();
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const handleEdit = (location: Location) => {
    setEditLocation(location);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (deleteLocationId !== null) {
      try {
        await fetch(`http://localhost:5248/api/locations/${deleteLocationId}`, {
          method: "DELETE",
        });

        const updatedLocations = await fetch(
          "http://localhost:5248/api/locations"
        ).then((res) => res.json());
        const locationsArray = Array.isArray(updatedLocations)
          ? updatedLocations
          : updatedLocations.$values || [];
        console.log("Updated locations after delete:", locationsArray); // Debug log
        setLocations(locationsArray);
        setDeleteLocationId(null);
      } catch (error) {
        console.error("Error deleting location:", error);
      }
    }
  };

  const handleRequestSort = (
    _event: React.MouseEvent<unknown, MouseEvent>,
    property: keyof Location
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
              {Array.isArray(locations) && locations.length > 0 ? (
                locations
                  .sort(getComparator(order, orderBy))
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
                          onClick={() => setDeleteLocationId(location.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No locations available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={Array.isArray(locations) ? locations.length : 0}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteLocationId !== null}
        onClose={() => setDeleteLocationId(null)}
      >
        <DialogTitle>Delete Location?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this location?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteLocationId(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LocationList;
