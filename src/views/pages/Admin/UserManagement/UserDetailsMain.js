import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import GeneralInformation from "./GeneralInformation";
import LoginSectionActivities from "./LoginSectionActivities";
import ParticipatedEvents from "./ParticipatedEvents";
import UserListedNFTs from "./UserListedNFTs";

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
      padding: "10px",
      cursor: "pointer",
      [theme.breakpoints.down("xs")]: {
        marginLeft: "0px",
      },
      "& p": {
        color: "rgba(255, 255, 255, 0.6)",
      },
    },
    "& .activeTab": {
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "10px",
      padding: "10px",
      cursor: "pointer",
      [theme.breakpoints.down("xs")]: {
        marginLeft: "0px",
      },
    },
  },
}));

export default function UserDetailsMain() {
  const classes = useStyles();
  const [tabs, setTabs] = useState("GeneralInformation");
  return (
    <Box className={classes.liveEventBox}>
      <Paper elevation={2} className="displayStart">
        <Box
          className={tabs === "GeneralInformation" ? "activeTab" : "tabBox"}
          onClick={() => setTabs("GeneralInformation")}
        >
          <Typography variant="body2" color="primary">
            General Information
          </Typography>
        </Box>
        <Box
          className={tabs === "ListedNFTs" ? "activeTab" : "tabBox"}
          ml={3}
          onClick={() => setTabs("ListedNFTs")}
        >
          <Typography variant="body2" color="primary">
            Listed NFTs
          </Typography>
        </Box>
        <Box
          className={tabs === "LoginSessionActivity" ? "activeTab" : "tabBox"}
          ml={3}
          onClick={() => setTabs("LoginSessionActivity")}
        >
          <Typography variant="body2" color="primary">
            Login Session Activity
          </Typography>
        </Box>
        <Box
          className={tabs === "ParticipatedEvents" ? "activeTab" : "tabBox"}
          onClick={() => setTabs("ParticipatedEvents")}
        >
          <Typography variant="body2" color="primary">
            Participated Events
          </Typography>
        </Box>
      </Paper>

      <Box mt={4}>
        {tabs === "GeneralInformation" && <GeneralInformation />}
      </Box>
      <Box mt={4}>{tabs === "ListedNFTs" && <UserListedNFTs />}</Box>
      <Box mt={4}>
        {tabs === "LoginSessionActivity" && <LoginSectionActivities />}
      </Box>
      <Box mt={4}>
        {tabs === "ParticipatedEvents" && <ParticipatedEvents />}
      </Box>
    </Box>
  );
}
