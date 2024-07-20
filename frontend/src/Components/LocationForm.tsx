import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { Location } from "../Models/Location";

interface LocationFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (location: Location) => void;
  location?: Location | null;
}

const LocationForm: React.FC<LocationFormProps> = ({
  open,
  onClose,
  onSave,
  location,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (location) {
      setName(location.name);
    }
  }, [location]);

  const handleSave = () => {
    onSave({ id: location ? location.id : 0, name });
    setName("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {location ? "Edit Location" : "Add New Location"}
      </DialogTitle>
      <DialogContent style={{ marginTop: "20px" }}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Location Name"
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

export default LocationForm;
