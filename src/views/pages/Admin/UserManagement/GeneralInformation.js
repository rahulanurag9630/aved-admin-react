import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  mintedBox: {
    marginTop: "8px",
    padding: "20px",

    "& p": {
      wordBreak: "break-word",
      color: "rgba(255, 255, 255, 0.6)",

      "& span": {
        color: "#fff",
        fontWeight: 500,
      },
    },
  },
}));

export default function GeneralInformation() {
  const classes = useStyles();
  return (
    <Box className={classes.mintedBox}>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6} md={6} lg={4}>
          <Box className="displaySpacebetween">
            <Box>
              <Typography variant="body2">
                <span>Name</span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">:</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
          <Box className="displayEnd">
            <Box>
              <Typography variant="body2">Arvind Tyagi</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={4}></Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
          <Box className="displaySpacebetween">
            <Box>
              <Typography variant="body2">
                <span>User Wallet Address</span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">:</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
          <Box className="displayEnd">
            <Box className="displaySpacebetween">
              <Box>
                <Typography variant="body2">
                  0x21wx1wx57xw5x7wx1w8xwx...
                </Typography>
              </Box>
              <Box ml={1}>
                <img src="images/copy.png" alt="copyimg" />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={4}></Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
          <Box className="displaySpacebetween">
            <Box>
              <Typography variant="body2">
                <span>Phone Number</span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">:</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
          <Box className="displayEnd">
            <Box>
              <Typography variant="body2">+91 9876543210</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={4}></Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
          <Box className="displaySpacebetween">
            <Box>
              <Typography variant="body2">
                <span>User Registration Date & Time</span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">:</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
          <Box className="displayEnd">
            <Box>
              <Typography variant="body2">24/03/2023 5:33 PM</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={4}></Grid>
      </Grid>
    </Box>
  );
}
