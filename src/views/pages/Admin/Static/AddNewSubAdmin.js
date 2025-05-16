import Topheading from "src/component/TopHeading";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles(() => ({
  subAdminContatiner: {
    "& p": {
      "& span": {
        color: "#FF4700",
      },
    },
    "& .basicInfoBox": {
      padding: "40px 0px",
    },
    "& .MuiSvgIcon-fontSizeSmall": {
      color: "#071c35",
    },
  },
  outlineborder1: {
    "& .react-tel-input .form-control": {
      width: "100%",
      color: "#6D6D6D",
      borderRadius: "8px",
      height: "55px",
      background: "rgba(255, 255, 255, 0.05)",
      border: "1px solid #ffffff00",
    },
    "& .react-tel-input .country-list .country": {
      padding: "7px 9px",
      textAlign: "left",
      backgroundColor: "#2D2D2D",
      color: "#fff",
      "&:hover": {
        background: "#000000e3",
      },
    },
    "& .react-tel-input .selected-flag:hover, .react-tel-input .selected-flag:focus":
    {
      backgroundColor: "transparent !important",
    },
    "& .react-tel-input .selected-flag": {
      backgroundColor: "#202020",
    },
    "& .react-tel-input .selected-flag .arrow": {
      left: "20px",
    },

    "& .react-tel-input .country-list .country.highlight": {
      backgroundColor: "#000000e3",
    },
    "& .react-tel-input .selected-flag": {
      "&:hover": {
        backgroundColor: "none",
      },
    },
    "& .react-tel-input .flag-dropdown ": {
      backgroundColor: "transparent",
      //   borderRight: "1px solid #949494",
      border: "none",
      height: "44px",
      position: "absolute",
      top: "5px",
    },
    "& .react-tel-input .flag-dropdown.open .selected-flag": {
      background: "#FFFFFF06",
    },
  },
}));
const DataTable = [
  {
    data: "User Management",
  },
  {
    data: "NFT Management",
  },
  {
    data: "Event Management",
  },
  {
    data: "Transaction management",
  },
  {
    data: "Static Management",
  },
];
export default function AddNewSubAdmin() {
  const classes = useStyles();
  const [age, setAge] = React.useState(10);
  const [phone, setPhone] = useState();
  const history = useHistory();
  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <Box className={classes.subAdminContatiner}>
      <Topheading heading="Add new sub admin" />
      <Box>
        <Box pb={1}>
          <Typography variant="h6">Basic details</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item sm={6}>
            <Typography variant="body1">
              First Name <span>*</span>{" "}
            </Typography>

            <TextField
              variant="outlined"
              fullWidth
              placeholder="Please enter first name"
            />
          </Grid>
          <Grid item sm={6}>
            <Typography variant="body1" color="primary">
              Last Name <span>*</span>{" "}
            </Typography>

            <TextField
              variant="outlined"
              fullWidth
              placeholder="Please enter last name"
            />
          </Grid>
          <Grid item sm={6}>
            <Typography variant="body1" color="primary">
              Email <span>*</span>{" "}
            </Typography>

            <TextField
              variant="outlined"
              fullWidth
              placeholder="Please enter email"
            />
          </Grid>
          <Grid item sm={6}>
            <Typography variant="body1">
              Phone Number <span>*</span>{" "}
            </Typography>
            <FormControl
              fullWidth
              variant="filled"
              className={classes.outlineborder1}
            >
              <PhoneInput
                country={"us"}
                name="phoneNo"
                value={phone}
                onChange={(phone) => setPhone(phone)}
              />
            </FormControl>
          </Grid>
          <Grid item sm={6}>
            <Typography variant="body1">
              {" "}
              Gender <span>*</span>{" "}
            </Typography>
            <FormControl fullWidth className={classes.formControl}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              >
                <MenuItem value={10}>Male</MenuItem>
                <MenuItem value={20}>Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Box className="basicInfoBox">
          <Typography variant="h6">Basic details</Typography>
        </Box>
        <TableContainer>
          <Table className={classes.tableBox}>
            <TableHead>
              <TableRow alignItems="center">
                <TableCell>ID</TableCell>
                <TableCell>Created on</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {DataTable.map((value) => (
                <TableRow>
                  <TableCell> {value.data}</TableCell>
                  <TableCell>
                    <Checkbox
                      size="small"
                      inputProps={{ "aria-label": "checkbox with small size" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box py={3} align="center">
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
}
