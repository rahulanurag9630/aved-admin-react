import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import Topheading from "src/component/TopHeading";
import FullCWNDeposit from "../WalletManagement/FullCWNDeposit";

const useStyles = makeStyles((theme) => ({
  profileBox: {
    padding: "0px 0px 50px",

    "& .tabBox": {
      "& p": {
        color: "#000",
      },
    },
    "& .activeTab": {
      "& p": {},
    },
  },
}));

const buttonArray = [
  { heading: "Fuel Deposit", value: "FuelCWNDeposit" },
  {
    heading: "Fuel Deduction",
    value: "FuelCWNWithdrawal",
  },
  {
    heading: "Loss Wallet",
    value: "FUEL_WALLET_COPYTRADING",
  },
];

export default function WalletTab() {
  const classes = useStyles();
  const [tabs, setTabs] = useState("FuelCWNDeposit");

  const ContentData = (
    <Box mt={2.4}>
      <Paper
        elevation={2}
        className="displayStart"
        style={{ flexWrap: "wrap", gap: "10px" }}
      >
        {buttonArray.map((item, i) => {
          return (
            <Box
              key={i}
              className={tabs === item?.value ? "activeTab" : "tabBox"}
              onClick={() => setTabs(item?.value)}
            >
              <Typography variant="body2" color="primary">
                {item?.heading}
              </Typography>
            </Box>
          );
        })}
      </Paper>
    </Box>
  );

  return (
    <Box className={classes.profileBox}>
      <Topheading heading="Fuel Transaction Management" />
      {ContentData}
      {tabs && <FullCWNDeposit tabs={tabs} />}
    </Box>
  );
}
