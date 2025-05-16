import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import NavBar, { dashboardArray, sections, settingArray } from "./NavBar";
import TopBar from "./TopBar";
import { Box, Avatar } from "@material-ui/core";
import SettingsContext from "src/context/SettingsContext";
import Footer from "./Footer";
import { AuthContext } from "src/context/Auth";
import { useHistory } from "react-router-dom";
import { getUpdatedRoutes, routeGroups } from "src/utils";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
    backgroundColor: "#181523",
    position: "relative",
  },
  root1: {
    backgroundColor: "#000",
    position: "relative",
    height: "100vh",
    "& .MainLayoutmain": {
      zIndex: "1",
      overflow: "hidden",
      position: "relative",
      backgroundSize: "cover",
      backgroundColor: "#181523",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top right",
    },
  },
  wrapper1: {
    backgroundColor: "#181523",
    // display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    position: "relative",
    // paddingTop: 70,
    // minHeight: "calc(100vh - 75px)",
    minHeight: "100dvh",

    "@media (max-width:767px)": {
      paddingTop: "10px !important",
    },
  },
  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#181523",
    paddingTop: 70,

    minHeight: "100dvh",
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 256,
    },
    "@media (max-width:767px)": {
      paddingTop: "70px !important",
    },
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    overflow: "hidden",
  },
  content: {
    flex: "1 1 auto",
    height: "100%",
    overflow: "auto",
    position: "relative",
    padding: "20px",
    backgroundColor: "#181523",
    color: "#fff",
    // minHeight: "600px",
    minHeight: "calc(100vh - 75px)",
    "@media (max-width: 1280px)": {
      padding: "20px",
    },
    [theme.breakpoints.down("md")]: {
      padding: "20px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "20px",
    },
  },
}));

const DashboardLayout = ({ children }) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const themeSeeting = useContext(SettingsContext);

  function sayHello() {
    // alert('Hello!');
    document.getElementById("mySidenav").style.width = "280px";
    document.getElementById("mySidenav").classList.remove("hiddenNav");
    document.getElementById("main").style.marginLeft = "290px";
    document.getElementById("openbutton").classList.add("hide");
    document.getElementById("closebutton").classList.remove("hide");
    // document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }
  function cloneNav() {
    document.getElementById("mySidenav").style.width = "80px";
    document.getElementById("main").style.marginLeft = "80px";
    document.getElementById("openbutton").classList.remove("hide");
    document.getElementById("mySidenav").classList.add("hiddenNav");
    document.getElementById("closebutton").classList.add("hide");
  }
  useEffect(() => {
    if (auth?.userData) {
      const matchedItems = [
        ...dashboardArray,
        ...sections,
        ...settingArray,
      ].flatMap((section) =>
        section.items.filter(
          (item) =>
            auth?.userData?.permissions &&
            [
              ...auth?.userData?.permissions?.map((item) => item.name),
              ...["Dashboard", "Settings"],
            ].includes(item.title)
        )
      );
      const matchedArray = matchedItems?.map((item) => item.href);
      const result = getUpdatedRoutes(matchedArray, routeGroups);
      const matchFound = result.includes(window.location.pathname);
      if (
        auth.userLoggedIn &&
        auth?.userData?.userType == "SUBADMIN" &&
        !matchFound
      ) {
        history.push("/dashboard");
      }
    }
  }, [auth, window.location.pathname, sections]);

  return (
    <div
      className={
        themeSeeting.settings.theme === "DARK"
          ? `${classes.root1}`
          : `${classes.root}`
      }
    >
      <Box className="MainLayoutmain">
        <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
        <Box>
          <div id="mySidenav" className={`${classes.sidebarleft} sidenav`}>
            {/* openmenu */}
            <Box>
              {/* <Typography variant="h6">hjli</Typography> */}
              <Avatar id="closebutton" onClick={cloneNav} className="closebtn ">
                <ChevronLeftIcon />
              </Avatar>
            </Box>

            {/* openmenu */}
            {/* closemenu */}
            <Avatar
              id="openbutton"
              onClick={sayHello}
              className="closebtn hide"
            >
              <ChevronRightIcon />
            </Avatar>
            {/* closemenu */}
            <NavBar
              onMobileClose={() => setMobileNavOpen(false)}
              openMobile={isMobileNavOpen}
            />
          </div>
        </Box>

        <main id="main" style={{ marginLeft: "280px" }}>
          <div
            className={
              themeSeeting.settings.theme === "DARK"
                ? `${classes.wrapper1}`
                : `${classes.wrapper}`
            }
          >
            <div className={classes.contentContainer}>
              <div className={classes.content} id="main-scroll">
                {children}
              </div>
            </div>
            <Footer />
          </div>
        </main>
      </Box>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;
