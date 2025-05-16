import {
  Box,
  Paper,
  Grid,
  TextField,
  FormControl,
  Button,
  Select,
  MenuItem,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { downloadExcel, listUserHandlerExcel } from "src/utils";
import { IoDownloadOutline } from "react-icons/io5";
import { SlLogout } from "react-icons/sl";

const useStyles = makeStyles((theme) => ({
  mainfilterBox: {
    "& .MuiInputAdornment-positionEnd": {
      marginRight: "-10px",
    },
    "& p": {
      fontSize: "13px",
      fontWeight: "500",
      color: "#f7f7f7 !important",
    },
    "& .displayEnd": {
      gap: "10px",
    },
  },
}));
const menuProps = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
  getContentAnchorEl: null, // Important for opening from bottom
};

export default function MainFilter({
  selectFilter,
  setSelectFilter,
  handleCallApi,
  filterData,
  excelTableName,
  apiEndPoint,
  transactionList,
  type,
  placeholder,
  tableDataFunction,
  handleClearApi,
}) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const showSelect = ["transactionMgmt", "eventMgmt", "announcement"];

  const selectArray = [
    { value: "All", name: "All" },
    ...(type === "fuelwallet"
      ? [
          { value: "BUY", name: "Buy" },
          { value: "SELL", name: "Sell" },
        ]
      : type === "sharedprofit"
      ? [
          { value: "CREDIT", name: "Credit" },
          { value: "DEBIT", name: "Debit" },
        ]
      : type === "rewardMgmt"
      ? [
          { value: "GROUP_VICE_PRESIDENT", name: "Group Vice President" },
          { value: "SALES_MANAGER", name: "Sales Manager" },
          { value: "SALES_DIRECTOR", name: "Sales Director" },
        ]
      : type === "rewardDistri"
      ? [
          { value: "Sales_Director", name: "Sales Director" },
          { value: "Sales_Manager", name: "Sales Manager" },
          { value: "Group_Vice_President", name: "Group Vice President" },
          { value: "Trading_Pool", name: "Trading Pool" },
          { value: "Management", name: "Management Pool" },
          { value: "Owner_A", name: "Owner A" },
          { value: "Owner_B", name: "Owner B" },
        ]
      : [
          { value: "ACTIVE", name: "Active" },
          { value: "BLOCK", name: "Blocked" },
        ]),
  ];

  const selectWalletArray = [
    { value: "All", name: "All" },

    { value: "ACTIVE", name: "Active" },
    { value: "INACTIVE", name: "Inactive" },
  ];

  return (
    <Paper
      elevation={2}
      style={{ backgroundColor: "#252233" }}
      className={classes.mainfilterBox}
    >
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item xs={12} sm={12} md={2}>
          <Typography
            variant="body2"
            color="secondary"
            style={{ marginBottom: "5px" }}
          >
            Filter By:
          </Typography>
          <FormControl fullWidth>
            <TextField
              variant="outlined"
              placeholder={placeholder ? placeholder : "Search"}
              value={selectFilter?.search}
              onChange={(e) => {
                if (e.target.value.length <= 256) {
                  setSelectFilter({
                    ...selectFilter,
                    ["search"]: e.target.value,
                  });
                }
              }}
            />
          </FormControl>
        </Grid>
        
        {!showSelect.includes(type) && (
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="body2"
              color="secondary"
              style={{ marginBottom: "5px" }}
            >
              {type === "userList" && "User"}{" "}
              {type === "rewardMgmt" ? "Pool Name" : "Status"}
            </Typography>
            <FormControl variant="outlined" fullWidth>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                name="status"
                value={selectFilter?.status}
                MenuProps={menuProps}
                onChange={(e) =>
                  setSelectFilter({
                    ...selectFilter,
                    ["status"]: e.target.value,
                  })
                }
              >
                {selectArray?.map((item, i) => (
                  <MenuItem key={i} value={item?.value}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="body2"
            color="secondary"
            style={{ marginBottom: "5px" }}
          >
            From
          </Typography>
          <FormControl fullWidth>
            <KeyboardDatePicker
              inputVariant="outlined"
              id="date-picker-dialog"
              format="DD/MM/YYYY"
              placeholder="DD/MM/YYYY"
              disableFuture
              InputProps={{ readOnly: true }}
              value={selectFilter?.fromDate}
              onChange={(date) =>
                setSelectFilter({
                  ...selectFilter,
                  ["fromDate"]: new Date(date),
                })
              }
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="body2"
            color="secondary"
            style={{ marginBottom: "5px" }}
          >
            To
          </Typography>
          <FormControl fullWidth>
            <KeyboardDatePicker
              inputVariant="outlined"
              id="date-picker-dialog"
              format="DD/MM/YYYY"
              placeholder="DD/MM/YYYY"
              disableFuture
              minDate={selectFilter?.fromDate}
              InputProps={{ readOnly: true }}
              disabled={!selectFilter?.fromDate}
              value={selectFilter?.toDate}
              onChange={(date) =>
                setSelectFilter({
                  ...selectFilter,
                  ["toDate"]: new Date(date),
                })
              }
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Box className="filterresponsiveButton" mt={3}>
            {/* <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleCallApi()}
              className="filterButtonCustom"
            >
              Search
            </Button> */}
            <Box className="rectangularButton">
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                className="filterButtonCustom"
                onClick={() => handleClearApi()}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={2} style={{ marginTop: "8px" }}>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            className="filterButtonCustom"
            disabled={isLoading}
            startIcon={<SlLogout style={{ fontSize: "15px" }} />}
            onClick={async () => {
              if (transactionList?.length > 0) {
                setIsLoading(true);
                const response = await listUserHandlerExcel({
                  paramsData: filterData,
                  endPoint: apiEndPoint,
                });
                if (response) {
                  downloadExcel(
                    tableDataFunction ? tableDataFunction(response) : response,
                    excelTableName
                  );
                }
                setIsLoading(false);
              } else {
                toast.error("No data found!");
              }
            }}
          >
            {isLoading ? "Loading..." : "Download CSV"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
