import React from "react";
import { Table, TableCell, TableBody, TableRow } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

export default function TopTradingSkeleton({ skeleton }) {
  return (
    <TableRow style={{ background: "#282435" }}>
      {skeleton &&
        skeleton?.map((data, index) => (
          <TableCell key={index}>
            <Skeleton
              animation="wave"
              height={15}
              width="82%"
              style={{ marginBottom: 6 }}
            />
          </TableCell>
        ))}
    </TableRow>
  );
}
