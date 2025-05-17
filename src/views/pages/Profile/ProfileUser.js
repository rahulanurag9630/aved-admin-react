import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Topheading from "src/component/TopHeading";
import GeneralDetails from "src/component/GeneralDetails";
import ConnectedServices from "src/component/ConnectServices";
import UserTransactions from "src/component/UserTransactions";
import Lifestyle from "./Lifestyle";
import Prompts from "./Prompts";
import IdentityVerification from "./IdentityVerification";
import Activity from "./Activity";

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
  { heading: "Basic Profile", value: "BasicProfile" },
  { heading: "Lifestyle & Preferences", value: "Lifestyle" },
  { heading: "Prompts", value: "Prompts" },
  { heading: "Identity & Verification", value: "Identity" },
  { heading: "Activity & Behavior", value: "Activity" },
];

export default function ProfileUser() {
  const classes = useStyles();
  const location = useLocation();
  const userData = location?.state;
  const [tabs, setTabs] = useState("BasicProfile");

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
      <Topheading heading="User Details" />
      {ContentData}
      {tabs === "BasicProfile" && <GeneralDetails userData={userData} />}
      {tabs === "Transactions" && <UserTransactions userData={userData} />}
      {tabs === "ConnectedServices" && (
        <ConnectedServices userData={userData} />
      )}
      {tabs === "Lifestyle" && <Lifestyle userData={userData} />}
      {tabs === "Prompts" && <Prompts userData={userData} />}
      {tabs === "Identity" && <IdentityVerification userData={userData} />}
      {tabs === "Activity" && <Activity userData={userData} />}

    </Box>
  );
}
