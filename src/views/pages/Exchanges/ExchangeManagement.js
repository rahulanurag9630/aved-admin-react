import React, { useState } from "react";
import { Box, Grid, Typography, withStyles } from "@material-ui/core";
import ConnectedWithExchange from "./ConnectedWithExchange";
import RecentConnectedExchange from "./RecentConnectedExchange";
import Topheading from "src/component/TopHeading";

// Use withStyles instead of styled for custom styles
const styles = (theme) => ({
  mainBox: {
    "& h3": {
      fontWeight: 700,
    },
  },
});

const ExchangeTab = ({ classes }) => {
  const [editExchangeData, setEditExchangeData] = useState();

  return (
    <Box className={classes.mainBox}>
      <Topheading heading={`${editExchangeData ? "Edit" : ""} Exchange`} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ConnectedWithExchange
            editExchangeData={editExchangeData}
            setEditExchangeData={setEditExchangeData}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RecentConnectedExchange
            editExchangeData={editExchangeData}
            setEditExchangeData={setEditExchangeData}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default withStyles(styles)(ExchangeTab);
