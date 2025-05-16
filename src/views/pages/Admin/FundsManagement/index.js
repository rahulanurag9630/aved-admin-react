import {
  Box,
  Button,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SalesDirector from "./SalesDirector";
import CwnLiquidity from "./CwnLiquidity";
import { apiRouterCall } from "src/ApiConfig/service";
import axios from "axios";
import { formatNumber } from "src/utils";
import AddWhitelistModal from "src/component/AddWhitelistModal";
import { SiSalesforce } from "react-icons/si";

const useStyles = makeStyles((theme) => ({
  liveEventBox: {
    position: "relative",
    zIndex: "999",

    "& .transparentbutton": {
      color: "#071c35 !important",
      backgroundColor: "#ffffff !important",
      border: "none !important",
      textDecoration: "underline !important",
      padding: "0px !important",
    },
    "& .displayStart": {
      [theme.breakpoints.down("xs")]: {
        // display: "block",
      },
    },
    "& .tabBox": {
      cursor: "pointer",
      padding: "10px 10px 17px 10px",
      minHeight: "100px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      zIndex: "999",
      overflow: "hidden",
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
      background: "#071c35",
      borderRadius: "10px",

      cursor: "pointer",
      // height: "73px",
      minHeight: "100px",
      [theme.breakpoints.down("xs")]: {
        marginLeft: "0px",
      },
      "& span": {
        fontSize: "10px",
      },
      "& p": {
        color: "#fff",
      },
      "& h6": {
        color: "#fff",
      },
    },
  },
  profileBox: {
    "& .tabBox": {
      minHeight: "auto",
      padding: "10px",
      "& p": {
        fontSize: "14px !important",
        // color: "#000",
      },
    },
    "& .activeTab": {
      minHeight: "auto",
      // padding: "10px",
      "& p": {
        fontSize: "14px !important",
      },
    },
  },
}));
const buttonArray = [
  {
    heading: "Active Wallet",
    value: "activewallets",
  },
  {
    heading: "Distributions",
    value: "distribution",
  },
];

export default function FundsManagement() {
  const classes = useStyles();
  const [tabs, setTabs] = useState("activewallets");
  const [fundData, setFundData] = useState();
  const [addWhiteListModal, setAddWhiteListModal] = useState(false);

  const handleGetTransaction = async (source, checkFilter) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "poolDashboard",
        source: source,
      });
      if (response.data.responseCode === 200) {
        setFundData(response.data.result);
      } else {
        setFundData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    handleGetTransaction(source);
    return () => {
      source.cancel();
    };
  }, []);

  return (
    <Box className={classes.liveEventBox}>
      <Grid container spacing={2} style={{ marginBottom: "10px" }}>
        <Grid item xs={11} sm={6} md={12}>
          <Typography variant="h3" color="primary">
            Reward Management
          </Typography>
          <Divider className="borderBox" />
        </Grid>
      </Grid>
      <Paper elevation={2} className="displayStart">
        <Grid container spacing={1}>
          <Grid item lg={2} md={3} sm={4} xs={6}>
            <Box
              className={tabs === "SALES_DIRECTOR" ? "activeTab" : "tabBox"}
              align="center"
              style={{ background: "rgb(132 108 249 / 44%)" }}
            >
              <Box
                className="dashShadeBox"
                style={{ background: "rgb(132 108 249 / 44%)" }}
              ></Box>

              <Box
                style={{
                  border: "1px dashed rgb(122 90 248)",
                  padding: "5px",
                  borderRadius: "100px",
                }}
                mb={1}
              >
                <Box
                  align="center"
                  className="displayCenter"
                  style={{
                    background: "rgb(122 90 248)",
                    width: "30px",
                    height: "30px",
                    borderRadius: "100%",
                  }}
                >
                  {" "}
                  <SiSalesforce
                    style={{
                      fontSize: "20px",
                      color: "#fff",
                    }}
                  />
                </Box>
              </Box>

              <Typography
                variant="subtitle1"
                style={{
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#f7f7f7",
                }}
              >
                Sales Director Pool
              </Typography>
              <Box mt={1}>
                <Typography variant="body2" color="primary">
                  {fundData?.directorActive || 0} Active
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={2} md={3} sm={4} xs={6}>
            <Box
              className={tabs === "SALES_MANAGER" ? "activeTab" : "tabBox"}
              align="center"
              style={{ background: "rgb(255 199 129 / 15%)" }}
            >
              <Box
                className="dashShadeBox"
                style={{ background: "rgb(255 177 83 / 39%)" }}
              ></Box>
              <Box
                style={{
                  border: "1px dashed #ffb000",
                  padding: "5px",
                  borderRadius: "100px",
                }}
                mb={1}
              >
                <Box
                  align="center"
                  className="displayCenter"
                  style={{
                    background: "#ffb000",
                    width: "30px",
                    height: "30px",
                    borderRadius: "100%",
                  }}
                >
                  {" "}
                  <SiSalesforce
                    style={{
                      fontSize: "20px",
                      color: "#fff",
                    }}
                  />
                </Box>
              </Box>
              <Typography
                variant="subtitle1"
                style={{
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#f7f7f7",
                }}
              >
                Sales Manager Pool
              </Typography>{" "}
              <Box mt={1}>
                <Typography variant="body2" color="primary">
                  {fundData?.managerActive || 0} Active
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={2} md={3} sm={4} xs={6}>
            <Box
              className={
                tabs === "GROUP_VICE_PRESIDENT" ? "activeTab" : "tabBox"
              }
              align="center"
              style={{ background: "#f0fdf4" }}
            >
              <Box
                className="dashShadeBox"
                style={{ background: "rgb(39 195 87 / 51%)" }}
              ></Box>
              <Box
                style={{
                  border: "1px dashed rgb(16 213 76 / 90%)",
                  padding: "5px",
                  borderRadius: "100px",
                }}
                mb={1}
              >
                <Box
                  align="center"
                  className="displayCenter"
                  style={{
                    background: "rgb(16 213 76 / 90%)",
                    width: "30px",
                    height: "30px",
                    borderRadius: "100%",
                  }}
                >
                  {" "}
                  <SiSalesforce
                    style={{
                      fontSize: "20px",
                      color: "#fff",
                    }}
                  />
                </Box>
              </Box>
              <Typography
                variant="subtitle1"
                style={{
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#f7f7f7",
                }}
              >
                Group VP Pool
              </Typography>{" "}
              <Box mt={1}>
                <Typography variant="body2" color="primary">
                  {fundData?.presidentActive || 0} Active
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={2} md={3} sm={4} xs={6}>
            <Box
              className={tabs === "SALES_DIRECTOR" ? "activeTab" : "tabBox"}
              align="center"
              style={{ background: "#ecfeff" }}
            >
              <Box
                className="dashShadeBox"
                style={{ background: "rgb(55 226 235 / 45%)" }}
              ></Box>

              <Box
                style={{
                  border: "1px dashed rgb(10 214 226)",
                  padding: "5px",
                  borderRadius: "100px",
                }}
                mb={1}
              >
                <Box
                  align="center"
                  className="displayCenter"
                  style={{
                    background: "rgb(10 214 226)",
                    width: "30px",
                    height: "30px",
                    borderRadius: "100%",
                  }}
                >
                  {" "}
                  <SiSalesforce
                    style={{
                      fontSize: "20px",
                      color: "#fff",
                    }}
                  />
                </Box>
              </Box>
              <Typography
                variant="subtitle1"
                style={{
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#f7f7f7",
                }}
              >
                Sales Director Liquidity
              </Typography>
              <Box mt={1}>
                <Typography variant="body2" color="primary">
                  ${formatNumber(fundData?.totalSalesDirectorPool || 0, 5)}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={2} md={3} sm={4} xs={6}>
            <Box
              className={tabs === "SALES_MANAGER" ? "activeTab" : "tabBox"}
              align="center"
              style={{ background: "rgb(255 199 129 / 11%)" }}
            >
              <Box
                className="dashShadeBox"
                style={{ background: "rgb(255 177 83 / 39%)" }}
              ></Box>
              <Box
                style={{
                  border: "1px dashed #ffb000",
                  padding: "5px",
                  borderRadius: "100px",
                }}
                mb={1}
              >
                <Box
                  align="center"
                  className="displayCenter"
                  style={{
                    background: "#ffb000",
                    width: "30px",
                    height: "30px",
                    borderRadius: "100%",
                  }}
                >
                  {" "}
                  <SiSalesforce
                    style={{
                      fontSize: "20px",
                      color: "#fff",
                    }}
                  />
                </Box>
              </Box>
              <Typography
                variant="subtitle1"
                style={{
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#f7f7f7",
                }}
              >
                Sales Manager Liquidity
              </Typography>{" "}
              <Box mt={1}>
                <Typography variant="body2" color="primary">
                  ${formatNumber(fundData?.totalSalesManagerPool || 0, 5)}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={2} md={3} sm={4} xs={6}>
            <Box
              className={
                tabs === "GROUP_VICE_PRESIDENT" ? "activeTab" : "tabBox"
              }
              align="center"
              style={{ background: "#fef2f2" }}
            >
              <Box
                className="dashShadeBox"
                style={{ background: "rgb(253 215 215)" }}
              ></Box>
              <Box
                style={{
                  border: "1px dashed #ef4444",
                  padding: "5px",
                  borderRadius: "100px",
                }}
                mb={1}
              >
                <Box
                  align="center"
                  className="displayCenter"
                  style={{
                    background: "#ef4444",
                    width: "30px",
                    height: "30px",
                    borderRadius: "100%",
                  }}
                >
                  {" "}
                  <SiSalesforce
                    style={{
                      fontSize: "20px",
                      color: "#fff",
                    }}
                  />
                </Box>
              </Box>
              <Typography
                variant="subtitle1"
                style={{
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#f7f7f7",
                }}
              >
                Group VP Liquidity
              </Typography>{" "}
              <Box mt={1}>
                <Typography variant="body2" color="primary">
                  ${formatNumber(fundData?.totalVPPool || 0, 5)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Box className={classes.profileBox}>
        <Box mt={2.4}>
          <Paper elevation={2} className="displaySpacebetween">
            <Box
              className="displayStart"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              {buttonArray.map((item, i) => {
                return (
                  <Box
                    key={i}
                    className={tabs === item?.value ? "activeTab" : "tabBox"}
                    onClick={() => setTabs(item?.value)}
                  >
                    <Typography variant="body2" color="primary">
                      {item?.heading}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Button
              variant="contained"
              color="secondary"
              className="transparentbutton"
              onClick={() => setAddWhiteListModal(true)}
            >
              Add Whitelist
            </Button>
          </Paper>
        </Box>
      </Box>
      <Box mt={3}>
        {tabs === "activewallets" && <SalesDirector tabs={tabs} />}
        {tabs === "distribution" && <CwnLiquidity />}
      </Box>
      {addWhiteListModal && (
        <AddWhitelistModal
          openModal={addWhiteListModal}
          handleClose={() => setAddWhiteListModal(false)}
          callBack={() => {
            setTabs("");
            setTabs("activewallets");
          }}
        />
      )}
    </Box>
  );
}
