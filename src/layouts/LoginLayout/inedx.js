import React from "react";
import { Box, Typography, Container } from "@material-ui/core";

import Logo from "src/component/Logo";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  loginlayoutBanner: {
    overflow: "hidden",
    position: "relative",
    height: "100vh",
    // display: "flex",
    "& .MainLayoutmain": {
      height: "100vh",
      display: "flex",
      zIndex: 9,
      position: "relative",
      background: "#FFFFFF",
    },
    "& .loginlayoutleftSide": {
      width: "50%",
      height: "100vh",
      background: "#746058",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      "@media(max-width:1200px)": {
        display: "none",
      },
    },
    "& .rightlayoutleftSide": { width: "100%", height: "100vh", zIndex: 1, position: "relative", overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: 'url("images/bg2.jpg")', backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", "@media(max-width:1200px)": { width: "100%", }, },


    "& .loginLogo": {
      maxWidth: "350px",
      width: "100%",
    },
    "& .sideLayout": {
      // marginTop: "12%",
      textAlign: "center",
      color: "#fff",
    },
    "& .sideLayout1": {
      maxWidth: "470px",
      width: "100%",
      [theme.breakpoints.down("lg")]: {
        maxWidth: "439px",
      },
      [theme.breakpoints.down("sm")]: {
        maxWidth: "390px",
      },
    },
  },
}));

const LoginLayout = ({ children }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.loginlayoutBanner}>
      <div className="MainLayoutmain">
        {/* Left Side */}
        {/* <Box className="loginlayoutleftSide" style={{ position: "relative" }}>
          <img
            src="/images/loginshade.webp"
            alt="Shade"
            className="shadeImageBox"
          />
          <Box className="sideLayout">
            </Link>

            <Typography variant="h1" style={{}}>
              Admin Panel
            </Typography>
            <Typography
              variant="body1"
              style={{
                lineHeight: "24px",
                mt: 3,
                maxWidth: "400px",
                fontSize: "14px",
              }}
            >
              Welcome to the admin panel! Here you can manage users, view
              analytics, and handle system settings.
            </Typography>
          </Box>
        </Box> */}

        {/* Right Side */}
        <Box className="rightlayoutleftSide">
          <Box className="sideLayout1">
            <Box href="/" onClick={() => history.push("/")}>
              <a>
                <Box align="center" mb={0} style={{ padding: "0 5px" }}>
                  <Logo />
                </Box>
              </a>
            </Box>
            {children}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default LoginLayout;
