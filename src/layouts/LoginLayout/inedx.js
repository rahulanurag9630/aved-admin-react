import React from "react";
import { Box, Typography, Container } from "@material-ui/core";

import Logo from "src/component/Logo";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import "src/styles/loginOptimizations.css";

const useStyles = makeStyles((theme) => ({
  loginlayoutBanner: {
    overflow: "hidden",
    position: "relative",
    height: "100vh",
    "& .MainLayoutmain": {
      height: "100vh",
      display: "flex",
      zIndex: 9,
      position: "relative",
      background: "transparent",
    },
    "& .loginlayoutleftSide": {
      width: "50%",
      height: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"rgba(255,255,255,0.05)\"/><circle cx=\"10\" cy=\"60\" r=\"0.5\" fill=\"rgba(255,255,255,0.05)\"/><circle cx=\"90\" cy=\"40\" r=\"0.5\" fill=\"rgba(255,255,255,0.05)\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')",
        opacity: 0.3,
      },
      "@media(max-width:1200px)": {
        display: "none",
      },
    },
    "& .rightlayoutleftSide": {
      width: "100%",
      height: "100vh",
      zIndex: 1,
      position: "relative",
      overflow: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "2rem",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)",
        zIndex: -1,
      },
      "@media(max-width:1200px)": {
        width: "100%",
        padding: "1rem",
      },
      "@media(max-width:768px)": {
        padding: "0.5rem",
      },
    },
    "& .loginLogo": {
      maxWidth: "350px",
      width: "100%",
    },
    "& .sideLayout": {
      textAlign: "center",
      color: "#fff",
      zIndex: 2,
      position: "relative",
    },
    "& .sideLayout1": {
      maxWidth: "470px",
      width: "100%",
      position: "relative",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.down("lg")]: {
        maxWidth: "439px",
      },
      [theme.breakpoints.down("sm")]: {
        maxWidth: "390px",
      },
      [theme.breakpoints.down("xs")]: {
        maxWidth: "100%",
        padding: "0 1rem",
      },
    },
  },
}));

const LoginLayout = ({ children }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={`${classes.loginlayoutBanner} login-background login-container`}>
      <div className="MainLayoutmain">
        {/* Left Side */}
        <Box className="loginlayoutleftSide">
          <Box className="sideLayout">
            <Typography
              variant="h1"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: "3rem",
                marginBottom: "1rem",
                background: "linear-gradient(45deg, #fff 30%, #f0f0f0 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="h4"
              style={{
                lineHeight: "1.4",
                marginBottom: "2rem",
                fontWeight: 300,
                opacity: 0.9
              }}
            >
              Admin Panel
            </Typography>
            <Typography
              variant="body1"
              style={{
                lineHeight: "1.6",
                maxWidth: "400px",
                fontSize: "16px",
                opacity: 0.8,
                fontWeight: 300
              }}
            >
              Manage your platform with ease. Access analytics, user management,
              and system settings all in one place.
            </Typography>
          </Box>
        </Box>

        {/* Right Side */}
        <Box className="rightlayoutleftSide">
          <Box className="sideLayout1">
            <Box
              onClick={() => history.push("/")}
              style={{
                cursor: "pointer",
                marginBottom: "2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Logo />
            </Box>
            {children}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default LoginLayout;
