import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles"; // Replaces `styled` from MUI v5
import { ExchangeLogo, capitalizeFirstLetter, formatNumber } from "src/utils";
import Topheading from "src/component/TopHeading";
import { apiRouterCall } from "src/ApiConfig/service";
import PhotoSkeleton from "src/component/Skeletons/PhotoSkeleton";
import NoDataFound from "src/component/NoDataFound";
import { useLocation } from "react-router-dom";

const styles = (theme) => ({
  dashboardSection: {
    position: "relative",
    "& .faqMainBox": {},
    "& .dashboardCard": {
      cursor: "pointer",
      "& p": {
        color: "#475467",
      },
      "& h3": {
        color: "#0C111D",
      },
    },
    "& .comingSoonOverlay": {
      position: "absolute",
      top: "60%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1000,
      color: "#FFFFFF",
      backgroundColor: "rgba(122, 90, 248, 0.9)",
      padding: theme.spacing(2, 4),
      borderRadius: "10px",
      textAlign: "center",
      whiteSpace: "pre",
    },
  },
  displaySpaceBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  displayStart: {
    display: "flex",
    alignItems: "center",
  },
});

function ExchangeIndex({ classes }) {
  const location = useLocation();
  const checkEdit = location?.state?.isEdit;
  const [isLoading, setIsLoading] = useState(false);
  const [connectedExchangeBalList, setConnectedExchangeBalList] = useState([]);

  const getConnectedExchangeBal = async () => {
    try {
      setIsLoading(true);
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "getBalance",
      });
      if (response.data.responseCode === 200) {
        setConnectedExchangeBalList(response.data.result);
      } else {
        setConnectedExchangeBalList([]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getConnectedExchangeBal();
  }, []);

  return (
    <Box className={classes.dashboardSection}>
      <Box className="faqMainBox">
        <Topheading
          heading="Exchanges"
          addButton="Add Exchange"
          pathname={checkEdit ? "/exchanges" : undefined}
        />
        <Grid container spacing={2} className="blurredContent">
          {!isLoading &&
            connectedExchangeBalList?.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper elevation={2}>
                  <Box className={classes.displaySpaceBetween}>
                    <Box className={classes.displayStart}>
                      <Typography variant="body2" color="primary">
                        {capitalizeFirstLetter(item?.exchangeName)}
                      </Typography>
                    </Box>
                    <Box>
                      <img
                        src={
                          ExchangeLogo.find(
                            (d) =>
                              d.title.toLowerCase() ===
                              item?.exchangeName.toLowerCase()
                          )?.img
                        }
                        alt="card image"
                        style={{ width: "40px", height: "40px" }}
                      />
                    </Box>
                  </Box>

                  <Typography
                    variant="h3"
                    color="primary"
                    lineHeight="47.9px"
                    mt={2}
                  >
                    {formatNumber(item?.accountBalance || 0, 8)} USDT
                  </Typography>
                  <Typography variant="body2" fontWeight="400" color="#98A2B3">
                    Wallet Balance
                  </Typography>
                </Paper>
              </Grid>
            ))}
          {isLoading &&
            [1, 2, 3, 4].map((itm, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <PhotoSkeleton type="phototab" />
              </Grid>
            ))}
        </Grid>
        {!isLoading && connectedExchangeBalList?.length === 0 && (
          <NoDataFound text="No Exchange Found!" />
        )}
      </Box>
    </Box>
  );
}

export default withStyles(styles)(ExchangeIndex);
