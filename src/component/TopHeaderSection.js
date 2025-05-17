import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Typography,
  Box,
  Button,
  Divider,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    // float:"right",
    padding: "15px",
    display: "flex",
    alignItems: "center",
    // justifyContent: "end",
    "& h4": {
      fontWeight: "600",
      // textDecoration:"underline"
    },
    "& p": {
      display: "flex",
      alignItems: "center",
    },
  },
}));

function TopHeaderSection({ heading, butname }) {
  const classes = useStyles();
  const [currentTime, setCurrentTime] = useState(Date());

  return (
    <Box mb={2}>
      <Typography variant="h3">{heading}</Typography>
      <Box mt={4} mb={4}>
        <Divider />
      </Box>
    </Box>
  );
}

export default TopHeaderSection;
