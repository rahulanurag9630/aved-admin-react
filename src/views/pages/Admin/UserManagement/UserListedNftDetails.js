import React, { useState, useEffect } from "react";
import {
  Box,
  makeStyles,
  Typography,
  Grid,
  Divider,
  Paper,
} from "@material-ui/core";
import TopHeaderSection from "src/component/TopHeaderSection";

const useStyles = makeStyles((theme) => ({
  bannerBox: {
    padding: "20px",
  },

  mintedBox: {
    marginTop: "8px",
    padding: "20px 20px 120px",
    "& h6": {
      fontFamily: "Sora",
      fontWeight: "500",
      fontSize: "18px",
      color: "rgba(255, 255, 255, 0.6)",
    },
    "& p": {
      wordBreak: "break-word",
      color: "rgba(255, 255, 255, 0.6)",
      fontWeight: 300,
      "& span": {
        color: "#fff",
        fontWeight: 500,
      },
    },
  },
}));

export default function MintScreen() {
  const classes = useStyles();
  const [type, setType] = useState("Select Type");

  return (
    <Box className={classes.bannerBox}>
      <Box mb={2} padding="16px">
        <TopHeaderSection heading="User Listed NFTs Details" />
      </Box>

      <Paper elevation={2} className={classes.welcomeBox}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={6} style={{ padding: "20px" }}>
            <Box
              mt={1}
              style={{ width: "422px", height: "450px", margin: "0 auto" }}
            >
              <img
                src="/images/Garage/garageImage.png"
                width="100%"
                height="100%"
                alt="carImage"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Paper elevation={2} className={classes.mintedBox}>
              <Box mt={1} mb={2}>
                <Typography variant="h3">Theta Punk -001</Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Typography variant="body2">
                    <span>Address</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Box className="displayStart">
                    <Typography variant="body2">
                      0x21wx1wx57xw5x7wx1w8xwx
                    </Typography>
                    &nbsp;&nbsp;
                    {/* <img src="images/copy.png" alt="copyimg" style={{cursor:"pointer"}} /> */}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Typography variant="body2">
                    <span>Creator</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Typography variant="body2">Arvind Tyagi</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6">Chain Info</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Typography variant="body2">
                    <span>Token ID</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Typography variant="body2">14</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Typography variant="body2">
                    <span>Blockchain</span>{" "}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Typography variant="body2">ImmutableX</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
