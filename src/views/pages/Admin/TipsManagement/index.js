import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Topheading from "src/component/TopHeading";

import UserTransactions from "src/component/UserTransactions";

import Tips from "./Tips";
import Events from "./Events";

const useStyles = makeStyles((theme) => ({
  profileBox: {
    padding: "0px 0px 50px",

    "& .tabBox": {
      "& p": {
        fontSize: "14px !important",
        color: "#000",
      },
    },
    "& .activeTab": {
      "& p": {
        fontSize: "14px !important",
      },
    },
  },
}));

const buttonArray = [
  { heading: "Tips", value: "Tips" },
  { heading: "Events", value: "Events" },
 
];

export default function Home() {
  const classes = useStyles();
  const location = useLocation();
  const userData = location?.state;
  const [tabs, setTabs] = useState("Tips");

  const ContentData = (
    <Box mt={2.4} mb={2}>
      <Paper
        elevation={2}
        className="displayStart"
        style={{ flexWrap: "wrap", gap: "10px" }}
      >
        {buttonArray.map((item, i) => {
          return (
            <Box
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
     
      {ContentData}
      {tabs === "Tips" && <Tips userData={userData} />}
      {tabs === "Events" && <Events userData={userData} />}
      
    </Box>
  );
}
