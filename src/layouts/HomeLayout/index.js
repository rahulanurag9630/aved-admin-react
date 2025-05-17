import React, { useContext, useEffect } from "react";
import { makeStyles, Box } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Footer from "./Footer";
import TopBar from "./TopBar";
import { AuthContext } from "src/context/Auth";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    overflow: "hidden",
    "& .leftShade2": {
      position: "relative",
      zIndex: "999",
      boxShadow: "39px -9px 60px 49px #000000",
    },
  },
  MainLayout: {
    minHeight: "calc(100vh - 382px)",
  },
}));

const MainLayout = ({ children }) => {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);

  useEffect(() => {
    window.localStorage.removeItem("token");
    auth.setAdminIsLogin(false);
  }, [auth]);

  return (
    <div className={classes.root}>
      <div className="leftShade2"></div>
      {/* <Box className="loginRightSahdowdash"></Box> */}
      <TopBar />
      <div
        style={
          window.location.pathname !== "/"
            ? { display: "block" }
            : { display: "none" }
        }
      ></div>

      <div className={classes.MainLayout}>{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
