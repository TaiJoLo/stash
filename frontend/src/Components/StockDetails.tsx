import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { Stock } from "../Models/Stock";
import { Location } from "../Models/Location";

interface StockDetailsProps {
  stocks: Stock[];
  locations: Location[];
}

const StockDetails: React.FC<StockDetailsProps> = ({ stocks, locations }) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Stock Details
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Purchase Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.map((stock) => (
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
