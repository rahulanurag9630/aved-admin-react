import React, { useState, useEffect } from "react";
import {
  Box,
  makeStyles,
  Typography,
  Grid,
  Divider,
  Paper,
  Container,
  Button,
} from "@material-ui/core";
import TopHeaderSection from "src/component/TopHeaderSection";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  bannerBox: {
    padding: "30px 0px 100px",
    [theme.breakpoints.down("xs")]: {
      padding: "20px 0px",
    },
  },

  mintedBox: {
    marginTop: "8px",
    padding: "20px",
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

export default function NftdetailSection() {
  const classes = useStyles();
  const history = useHistory();
  const [type, setType] = useState("Select Type");

  return (
    <Box className={classes.bannerBox}>
      <Container>
        <Box>
          <TopHeaderSection heading="NFTs Detail" />
        </Box>

        <Paper elevation={2} className={classes.welcomeBox}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Box mt={1}>
                <img
                  src="/images/userlistnft.png"
                  width="100%"
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
                      <img
                        src="images/copy.png"
                        alt="copyimg"
                        style={{ cursor: "pointer" }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Typography variant="body2">
                      <span>Creater</span>
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
                <Box my={3} className="displayStart">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => history.push("/shop")}
                  >
                    Buy
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    variant="contained"
                    color="primary"
                    // onClick={() => history.push("/vehical-character")}
                  >
                    customize
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
