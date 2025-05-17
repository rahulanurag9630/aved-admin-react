import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import Topheading from "src/component/TopHeading";
import TradeTableSection from "./TradeTableSection";
import CancelTrade from "../Setting/CancelTrade";

const useStyles = makeStyles((theme) => ({
  profileBox: {
    padding: "0px 0px 50px",

    "& .tabBox": {
      "& p": {
        fontSize: "16px !important",
        color: "#000",
      },
    },
    "& .activeTab": {
      "& p": {
        fontSize: "16px !important",
      },
    },
  },
}));

const buttonArray = [
  { heading: "Open Positions", value: "OPEN" },
  { heading: "Closed Positions", value: "CLOSE" },
  { heading: "Open Order", value: "ORDER" },
  { heading: "Close Open Orders", value: "1" },
  { heading: "Close Position", value: "2" },
];

export default function TradeManagement() {
  const classes = useStyles();
  const [tabs, setTabs] = useState("OPEN");
  const [page, setPage] = useState(1);

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
              onClick={() => {
                page > 1 && setPage(1);
                setTabs(item?.value);
              }}
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
      <Topheading heading="Trade Management" />
      {ContentData}
      {tabs && tabs !== "1" && tabs !== "2" && (
        <TradeTableSection tabs={tabs} page={page} setPage={setPage} />
      )}
      {tabs && tabs !== "ORDER" && tabs !== "CLOSE" && tabs !== "OPEN" && (
        <CancelTrade tabs={tabs} />
      )}
    </Box>
  );
}
