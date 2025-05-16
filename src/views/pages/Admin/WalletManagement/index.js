import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Topheading from "src/component/TopHeading";
import FullCWNDeposit from "./FullCWNDeposit";

const useStyles = makeStyles((theme) => ({
  profileBox: {
    padding: "0px 0px 50px",

    "& .tabBox": {
      "& p": {
        color: "#ffff",
      },
    },
    "& .activeTab": {
      "& p": {},
    },
  },
}));

const buttonArray = [
  { heading: "Buy CWN", value: "FullCWNDeposit" },
  { heading: "Sell CWN", value: "FullCWNWithdrawal" }, // Removed extra space
];

export default function WalletTab() {
  const classes = useStyles();
  const location = useLocation();
  const userData = location?.state;
  const [tabs, setTabs] = useState("FullCWNDeposit");

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
              key={i} // Added key to improve React performance and avoid warnings
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
      <Topheading heading="Wallet Transaction Management" />
      {ContentData}
      {tabs && <FullCWNDeposit tabs={tabs} />}
    </Box>
  );
}
