import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  mintedBox: {
    display: "flex",
    justifyContent: "center",
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

export default function LoginSectionActivities() {
  const classes = useStyles();
  return (
    <Box className={classes.mintedBox}>
      <Grid container spacing={2} xs={12} sm={11} md={10} lg={8}>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Box className="displaySpacebetween">
            <Box>
              <Typography variant="body2">
                <span>Last Login</span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">:</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Box className="displayEnd">
            <Box>
              <Typography variant="body2">24/03/2023 5:33 PM</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}></Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Box className="displaySpacebetween">
            <Box>
              <Typography variant="body2">
                <span>Location</span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">:</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Box className="displayEnd">
            <Typography variant="body2">Chandigarh, Punjab</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}></Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Box className="displaySpacebetween">
            <Box>
              <Typography variant="body2">
                <span>Internet Service Provider</span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">:</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Box className="displayEnd">
            <Box>
              <Typography variant="body2">Airtel-Punjab (EAST)</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}></Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Box className="displaySpacebetween">
            <Box>
              <Typography variant="body2">
                <span>IP Address</span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">:</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Box className="displayEnd">
            <Box>
              <Typography variant="body2">24/03/2023 5:33 PM</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}></Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Box className="displaySpacebetween">
            <Box>
              <Typography variant="body2">
                <span>Last Transaction</span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">:</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Box className="displayEnd">
            <Box>
              <Typography variant="body2">24/03/2023 5:33 PM</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}></Grid>
      </Grid>
    </Box>
  );
}
