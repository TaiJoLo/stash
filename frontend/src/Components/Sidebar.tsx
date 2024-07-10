import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Inventory, Category, Storage } from "@mui/icons-material";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
      }}
    >
      <div style={{ padding: "16px" }}>
        <Typography variant="h6" noWrap>
          Stash
        </Typography>
      </div>
      <List>
        <ListItem button>
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText primary="Item" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Category />
          </ListItemIcon>
          <ListItemText primary="Category" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText primary="Stock" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
