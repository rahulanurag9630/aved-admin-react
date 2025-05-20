import PhotoSkeleton from "src/component/Skeletons/PhotoSkeleton";
import {
  Box,
  Typography,
  makeStyles,
  Grid,
  Divider,
  Paper,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { apiRouterCall } from "src/ApiConfig/service";
import { formatNumber } from "src/utils";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import { AuthContext } from "src/context/Auth";
import zIndex from "@material-ui/core/styles/zIndex";
import MostViewedProperty from "./MostViewedProperty";
import RecentalyAddedProperty from "./RecentalyAddedProperty";

const useStyles = makeStyles((theme) => ({
  dashboardBox: {
    position: "relative",
    zIndex: "999",
    "& .mainBox": {
      borderRadius: "5px !important",
      padding: "30px",
    },
    "& .MuiSelect-outlined": {
      display: "flex",
      minWidth: "106px",
      alignItems: "center",
      justifyContent: "space-between",
    },
    "& .MuiSelect-icon": {
      padding: "0px",
      top: "calc(50% - 12px)",
    },
    "& .countBox1": {
      borderRadius: "10px",
      padding: "20px",
      transition: "0.5s",
      position: "relative",
      zIndex: "999",
      overflow: "hidden",
      "&:hover": {
        transform: "translateY(-5px)",
      },
    },
    "& .tabButtonBox": {
      background: theme.palette.background.tab,
      borderRadius: "5px",
      padding: "6px 25px",
      marginLeft: "10px",
      cursor: "pointer",
      [theme.breakpoints.down("xs")]: {
        padding: "6px 15px",
      },
    },
    "& .tabActive": {
      background: theme.palette.background.tab,
      borderRadius: "5px",
      padding: "6px 25px",
      color: "#1E92AA !important",
      marginLeft: "10px",
      cursor: "pointer",
      [theme.breakpoints.down("xs")]: {
        padding: "6px 15px",
      },
    },
    "& .pieBox": {
      padding: "20px 0px 12px",
    },
    "& .filterBox": {
      margin: "0px 20px",
      [theme.breakpoints.down("xs")]: {
        margin: "7px 0px",
      },
    },
    "& .datepickerBox": {
      [theme.breakpoints.down("xs")]: {
        display: "block",
      },
      "& .MuiSvgIcon-root": {
        color: theme.palette.text.gray,
      },
      "& .buttonBox": {
        margin: "0px 14px",
        [theme.breakpoints.down("xs")]: {
          margin: "10px 0px",
        },
      },
    },

    // ✅ Move .trimText selector out here to apply globally within .dashboardBox


  },

  subTitleBox: {
    display: "flex",
    alignItems: "center",
  },
}));


export default function DashdoardHome() {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState();
  const [tradingDashboardData, setTradingDashboardData] = useState();

  const arrayData = [
    {
      title: "Total Properties",
      count: 160,
      background: "#846cf94d",
      color: "#3e2d91",
      background1: "rgb(132 108 249 / 44%)",
      active: 120,
      draft: 30,
      inactive: 50,
    },
    {
      title: "Total Leads & Inquiries",
      count: 245,
      background: "rgb(255 199 129 / 15%)",
      color: "#ffb153",
      background1: "rgb(255 177 83 / 39%)",

    },
    {
      title: "Published Blogs",
      count: 42,
      background: "rgb(255 199 129 / 15%)",
      color: "#ffb153",
      background1: "rgb(255 177 83 / 39%)",

    },
  ];


  const getDashboardData = async (source) => {
    try {
      setIsLoading(true);
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "dashboard",
        source: source,
      });
      if (response?.data?.responseCode === 200) {
        setDashboardData(response.data.result);
      } else {
        setDashboardData();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const getTradingDashboardData = async (source) => {
    try {
      setIsLoading(true);
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "copyTradingDashBoard",
        source: source,
      });
      if (response?.data?.responseCode === 200) {
        setTradingDashboardData(response.data.result);
      } else {
        setTradingDashboardData();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getDashboardData(source);
    getTradingDashboardData(source);
    return () => {
      source.cancel();
    };
  }, []);
  const [selectFilter, setSelectFilter] = useState({
    status: "today_paid_liquidity",
  });

  const handleChange = (e) => {
    setSelectFilter({
      ...selectFilter,
      status: e.target.value,
    });
  };

  const menuProps = {
    anchorOrigin: {
      vertical: "bottom", // Position the menu to open from the bottom
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top", // Align the menu with the top of the dropdown
      horizontal: "left",
    },
    getContentAnchorEl: null, // Ensures menu positioning is consistent
  };

  return (
    <Box className={classes.dashboardBox}>
      <Grid container spacing={3}>
        <Grid item xs={11} sm={6} md={12}>
          <Typography variant="h3" color="secondry">
            Dashboard
          </Typography>
          <Divider className="borderBox" />
        </Grid>
      </Grid>
      <Box
        mt={1.5}
        style={{ background: "#f3f4f6", borderRadius: "10px", padding: "20px" }}
      >
        <Grid container spacing={2}>
          {!isLoading &&
            arrayData?.map((value) => (
              <Grid item xs={12} sm={6} md={4} >
                <Box
                  className="countBox1"
                  align="left"
                  style={{ background: value.background, height: "80%" }}
                >
                  <Box
                    className="dashShadeBox"
                    style={{ background: value.background1 }}
                  ></Box>
                  <Typography
                    variant="h6"
                    style={{ color: "#000 !important", marginTop: "10px" }}
                  >
                    {value?.title}
                  </Typography>
                  <Box mt={1}>
                    <Typography
                      variant="body2"
                      color="primary"
                      className="countBox2"
                      style={{
                        fontWeight: "600",
                        fontSize: "20px",
                        marginBottom: "10px",
                        color: value.color || "#000", // Fallback to black if color is undefined
                      }}
                    >
                      {value?.count?.toLocaleString() || "0"}
                    </Typography>
                  </Box>
                  {value?.active && <Box className={classes.subTitleBox}>
                    <Typography variant="body2">Active:</Typography>
                    <Typography variant="subtitle1">{value?.active}</Typography>
                  </Box>
                  }
                  {value?.draft && <Box className={classes.subTitleBox}>
                    <Typography variant="body2">Draft:</Typography>
                    <Typography variant="subtitle1">{value?.draft}</Typography>
                  </Box>}
                  {value?.inactive &&
                    < Box className={classes.subTitleBox}>
                      <Typography variant="body2">Inactive:</Typography>
                      <Typography variant="subtitle1">{value?.inactive}</Typography>
                    </Box>
                  }

                </Box>
              </Grid>
            ))}
          {isLoading &&
            Array.from({ length: 13 }).map((_) => {
              return (
                <Grid item xs={12} sm={6} md={3}>
                  <PhotoSkeleton />
                </Grid>
              );
            })}
        </Grid>
        <Grid container spacing={2} style={{ background: "#F3F4F6", marginTop: "20px", }}>
          <Grid item xs={12} sm={6} md={6} style={{ padding: "10px", background: "#F3F4F6" }}>
            <Box
              style={{
                padding: "30px",
                background: "#FFF",
                borderRadius: "15px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
              }}
            >
              <Typography variant="h5">Most Viewed Properties</Typography>
              <MostViewedProperty />
            </Box>

          </Grid>
          <Grid item xs={12} sm={6} md={6} style={{ padding: "10px", background: "#F3F4F6" }}>
            <Box style={{ padding: "30px", background: "#FFF", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}><Typography variant="h5">Recentaly Added Properties
            </Typography>
              <RecentalyAddedProperty /></Box>

          </Grid>
        </Grid>
      </Box>
      {/* 
      <Box mt={3}>
        <Typography
          variant="h3"
          color="primary"
          style={{ marginBottom: "16px" }}
        >
          Liquidity Analytics
        </Typography>
        <Paper elevation={1} className="graphmainBox">
          <Box align="right">
            <FormControl variant="outlined">
              <Select
                name="status"
                value={selectFilter.status}
                onChange={handleChange}
                MenuProps={menuProps}
              >
                <MenuItem value="today_paid_liquidity">1 Days</MenuItem>

                <MenuItem value="pending">7 Days</MenuItem>
                <MenuItem value="completed">30 Days</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <BarChart />
        </Paper>
      </Box>

      <Box mt={3}>
        <Typography
          variant="h3"
          color="primary"
          style={{ marginBottom: "16px" }}
        >
          Users Analytics
        </Typography>

        <Paper elevation={1} className="graphmainBox">
          <Box align="right">
            <FormControl variant="outlined">
              <Select
                name="status"
                value={selectFilter.status}
                onChange={handleChange}
                MenuProps={menuProps}
              >
                <MenuItem value="today_paid_liquidity">1 Days</MenuItem>

                <MenuItem value="pending">7 Days</MenuItem>
                <MenuItem value="completed">30 Days</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <AreaChart />
        </Paper>
      </Box>

      <Box mt={3} mb={3}>
        <Typography
          variant="h3"
          color="primary"
          style={{ marginBottom: "16px" }}
        >
          Buy CWN Analytics
        </Typography>
        <Paper elevation={1} className="graphmainBox">
          <Box align="right">
            <FormControl variant="outlined">
              <Select
                name="status"
                value={selectFilter.status}
                onChange={handleChange}
                MenuProps={menuProps}
              >
                <MenuItem value="today_paid_liquidity">1 Days</MenuItem>

                <MenuItem value="pending">7 Days</MenuItem>
                <MenuItem value="completed">30 Days</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <BarChart />
        </Paper>
      </Box> */}
    </Box >
  );
}
