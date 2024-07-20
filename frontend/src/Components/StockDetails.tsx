import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableSortLabel,
} from "@mui/material";
import { Stock } from "../Models/Stock";
import { Location } from "../Models/Location";

interface StockDetailsProps {
  stocks: Stock[];
  locations: Location[];
}

type Order = "asc" | "desc";

const StockDetails: React.FC<StockDetailsProps> = ({ stocks, locations }) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Stock>("amount");

  const handleRequestSort = (property: keyof Stock) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedStocks = stocks.slice().sort((a, b) => {
    if (orderBy === "dueDate" || orderBy === "purchaseDate") {
      const aValue = a[orderBy] ? new Date(a[orderBy]!).getTime() : 0;
      const bValue = b[orderBy] ? new Date(b[orderBy]!).getTime() : 0;
      return (aValue - bValue) * (order === "asc" ? 1 : -1);
    }
    if (orderBy === "locationId") {
      const aLocation =
        locations.find((loc) => loc.id === a.locationId)?.name || "";
      const bLocation =
        locations.find((loc) => loc.id === b.locationId)?.name || "";
      return aLocation.localeCompare(bLocation) * (order === "asc" ? 1 : -1);
    }
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    return (aValue - bValue) * (order === "asc" ? 1 : -1);
  });

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Stock Details
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "amount"}
                  direction={orderBy === "amount" ? order : "asc"}
                  onClick={() => handleRequestSort("amount")}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "dueDate"}
                  direction={orderBy === "dueDate" ? order : "asc"}
                  onClick={() => handleRequestSort("dueDate")}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "locationId"}
                  direction={orderBy === "locationId" ? order : "asc"}
                  onClick={() => handleRequestSort("locationId")}
                >
                  Location
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "purchaseDate"}
                  direction={orderBy === "purchaseDate" ? order : "asc"}
                  onClick={() => handleRequestSort("purchaseDate")}
                >
                  Purchase Date
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStocks.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>{stock.amount}</TableCell>
                <TableCell>{stock.dueDate?.substring(0, 10)}</TableCell>
                <TableCell>
                  {locations.find((loc) => loc.id === stock.locationId)?.name ||
                    ""}
                </TableCell>
                <TableCell>{stock.purchaseDate?.substring(0, 10)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StockDetails;
