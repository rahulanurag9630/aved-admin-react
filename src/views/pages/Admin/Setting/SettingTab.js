import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import Profile from "./Profile";

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
      borderBottom: "2px solid #11D9EF",
      borderRadius: "0px",
      padding: "0px 0 7px",
      cursor: "pointer",
      [theme.breakpoints.down("xs")]: {
        marginLeft: "0px",
      },
      "& p": {
        color: "#11D9EF",
      },
      "& span": {
        fontSize: "10px",
      },
    },
  },
}));

export default function SettingTab({ userData }) {
  const classes = useStyles();
  return (
    <Box className={classes.liveEventBox} mt={3}>
      {/* <Paper
        elevation={2}
        className="displayStart"
        style={{ paddingBottom: "0px", gap: "5px" }}
      >
        <Box
          className={tabs === "settingprofile" ? "activeTab" : "tabBox"}
          onClick={() => setTabs("settingprofile")}
        >
          <Typography variant="body2" color="primary">
            Setting
          </Typography>
        </Box>
        <Box
          className={tabs === "1" ? "activeTab" : "tabBox"}
          ml={3}
          onClick={() => setTabs("1")}
        >
          <Typography variant="body2" color="primary">
            Close Open Orders
          </Typography>
        </Box>
        <Box
          className={tabs === "2" ? "activeTab" : "tabBox"}
          ml={3}
          onClick={() => setTabs("2")}
        >
          <Typography variant="body2" color="primary">
            Close Position
          </Typography>
        </Box>
      </Paper> */}

      <Box mt={3}>
        <Profile userData={userData} />
      </Box>
    </Box>
  );
}
