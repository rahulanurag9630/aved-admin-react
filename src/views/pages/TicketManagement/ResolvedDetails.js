import {
  Box,
  Button,
  IconButton,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  main__wrapper: {
    display: "flex",
    flexDirection: "column",
    "& > button": {
      margin: "10px 0",
    },
  },
  top__info: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  main__content: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    padding: "0 20px",
    overflow: "auto",
  },
  details: {
    display: "flex",
    gap: "104px",
    alignSelf: "center",
    "& > div": {
      display: "flex",
      flexDirection: "column",
      gap: "36px",
      // alignItems: 'center',
    },
    "& img": {
      width: "200px",
      height: "100px",
      borderRadius: "5px",
    },
  },
}));

const ResolvedDetails = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <Box className={classes.main__wrapper}>
      <Box sx={{ display: "flex", alignItems: "center" }} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowLeft style={{ color: "#fff" }} />
        </IconButton>
        <Typography variant="h4">Ticket Management</Typography>
      </Box>
      <Box className={classes.main__content}>
        <Typography variant="h4">TICKET DETAILS</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket Id</TableCell>
              <TableCell>1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                euismod bibendum laoreet.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                euismod bibendum laoreet.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Ramneek</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Customer Email</TableCell>
              <TableCell>ramneek@gmail.com</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Customer Ticket Status</TableCell>
              <TableCell>Pending</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Requested Date & Time</TableCell>
              <TableCell>15 Jun, 2022 7:49 PM</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Attachment</TableCell>
              <TableCell>
                <img
                  src="https://via.placeholder.com/200x100"
                  alt="attachment"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Solution Description</TableCell>
              <TableCell>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                euismod bibendum laoreet.
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginY: "12px" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResolvedDetails;
