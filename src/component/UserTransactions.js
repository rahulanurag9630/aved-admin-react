import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import SharedProfit from "./SharedProfit";
import ReferralTransactions from "./ReferralTransactions";
import FuelWallet from "./FuelWallet";
import { BorderBottom } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  liveEventBox: {
    position: "relative",
    zIndex: "999",
    "& .displayStart": {
      [theme.breakpoints.down("xs")]: {
        // display: "block",
      },
    },
    "& .tabBox": {
      cursor: "pointer",
      borderBottom: "2px solid transparent",
      padding: "0px 0 7px",
      [theme.breakpoints.down("xs")]: {
        marginLeft: "0px",
      },
      "& p": {
        color: "#000",
      },
      "& span": {
        fontSize: "10px",
      },
    },
    "& .activeTab": {
      background: "transparent",
      borderBottom: "2px solid #071c35",
      borderRadius: "0px",
      padding: "0px 0 7px",
      cursor: "pointer",
      [theme.breakpoints.down("xs")]: {
        marginLeft: "0px",
      },
      "& p": {
        color: "#071c35",
      },
      "& span": {
        fontSize: "10px",
      },
    },
  },
}));

export default function UserTransactions({ userData }) {
  const classes = useStyles();
  const [tabs, setTabs] = useState("shareProfit");
  return (
    <Box className={classes.liveEventBox} mt={3}>
      <Paper
        elevation={2}
        className="displayStart"
        style={{ paddingBottom: "0px" }}
      >
        <Box
          className={tabs === "shareProfit" ? "activeTab" : "tabBox"}
          onClick={() => setTabs("shareProfit")}
        >
          <Typography variant="body2" color="primary">
            Shared Profit <span>(Fuel Wallet)</span>
          </Typography>
        </Box>
        <Box
          className={tabs === "cwnTransactions" ? "activeTab" : "tabBox"}
          ml={3}
          onClick={() => setTabs("cwnTransactions")}
        >
          <Typography variant="body2" color="primary">
            CWN Transactions
          </Typography>
        </Box>
        <Box
          className={tabs === "referralTransactions" ? "activeTab" : "tabBox"}
          ml={3}
          onClick={() => setTabs("referralTransactions")}
        >
          <Typography variant="body2" color="primary">
            Referral Transaction
          </Typography>
        </Box>
      </Paper>

      <Box mt={3}>
        {tabs === "shareProfit" && <SharedProfit userData={userData} />}
      </Box>
      <Box mt={3}>
        {tabs === "cwnTransactions" && <FuelWallet userData={userData} />}
      </Box>

      <Box mt={3}>
        {tabs === "referralTransactions" && (
          <ReferralTransactions userData={userData} />
        )}
      </Box>
    </Box>
  );
}
