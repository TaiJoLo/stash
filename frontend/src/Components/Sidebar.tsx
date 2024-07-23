import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Inventory,
  Category,
  Storage,
  LocationOn,
  Assessment,
  Assignment,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleLinkClick = () => {
    if (isSmallScreen) {
      onClose();
    }
  };

  return (
    <div style={{ width: 240 }}>
      <div style={{ padding: "16px" }}>
        <Typography variant="h6" noWrap>
          Stash
        </Typography>
      </div>
      <List>
        <ListItem
          button
          component={NavLink}
          to="/products"
          onClick={handleLinkClick}
        >
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText primary="Product" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/categories"
          onClick={handleLinkClick}
        >
          <ListItemIcon>
            <Category />
          </ListItemIcon>
          <ListItemText primary="Category" />
        </ListItem>

        <ListItem
          button
          component={NavLink}
          to="/parent-products"
          onClick={handleLinkClick}
        >
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText primary="Parent Product" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/locations"
          onClick={handleLinkClick}
        >
          <ListItemIcon>
            <LocationOn />
          </ListItemIcon>
          <ListItemText primary="Location" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/stocks"
          onClick={handleLinkClick}
        >
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText primary="Stock Entries" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/stock-overview"
          onClick={handleLinkClick}
        >
          <ListItemIcon>
            <Assessment />
          </ListItemIcon>

          <ListItemText primary="Stock Overview" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/stock-journal"
          onClick={handleLinkClick}
        >
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText primary="Stock Journal" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
