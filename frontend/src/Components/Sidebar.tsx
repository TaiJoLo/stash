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
import { Inventory, Category, Storage, Add } from "@mui/icons-material";
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
          to="/items"
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
          to="/stocks"
          onClick={handleLinkClick}
        >
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText primary="Stock" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/items/new"
          onClick={handleLinkClick}
        >
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary="Add Product" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/stocks/new"
          onClick={handleLinkClick}
        >
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary="Add Stock" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/categories/new"
          onClick={handleLinkClick}
        >
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary="Add Category" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
