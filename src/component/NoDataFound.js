import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  imgBox: {
    maxWidth: "300px",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "200px",
      width: "100%",
    },
  },
  mainBox: {
    "& h5": {
      marginTop: "20px",
    },
  },
}));
export default function NoDataFound({ text, type }) {
  const classes = useStyles();
  return (
    <Box className={`${classes.mainBox} displayCenter`} mt={6} mb={4}>
      <Box align="center">
        {/* {type !== "event" && (
          <img
            src="images/nodatafound.png"
            alt="nodata"
            className={classes.imgBox}
          />
        )} */}
        <Typography variant="h6">{text ? text : "No data found!"}</Typography>
      </Box>
    </Box>
  );
}
