import {
  AppBar,
  Toolbar,
  makeStyles,
  Button,
  IconButton,
  Drawer,
  Grid,
  MenuItem,
  Box,
  Container,
  Menu,
  Dialog,
  DialogContent,
  Avatar,
  Hidden,
  SwipeableDrawer,
  Typography,
  TextField,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import Logo from "../../component/Logo";
import ConnectModal from "src/component/ConnectModal";
import { RxCross2 } from "react-icons/rx";
import { AiFillCaretDown } from "react-icons/ai";
import { withStyles } from "@material-ui/core/styles";
import AnnouncementCard from "src/component/AnnouncementCard";
import { IoClose } from "react-icons/io5";
import { AuthContext } from "src/context/Auth";
import { sortAddress } from "src/utils";
import toast from "react-hot-toast";
import { apiRouterCall } from "src/ApiConfig/service";
import { Form, Formik } from "formik";
import * as yup from "yup";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import { FaUserAlt } from "react-icons/fa";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { IoIosArrowDown } from "react-icons/io";

const headersData = [
  {
    label: "Race",
    href: "/practice-race",
  },

  {
    label: "Garage",
    href: "/shop",
  },
  {
    label: "Mint",
    href: "/mint",
  },
  {
    label: "Leaderboard",
    href: "/leaderboard-result",
  },

  // {
  //   label: "Live",
  //   href: "/live-and-upcomming",
  // },
  {
    label: "Learn More",
    href: "/learn-more",
  },
  {
    label: "Login",
    href: "/login",
  },
];
const announcement = [{}, {}, {}];
const useStyles = makeStyles((theme) => ({
  menubox: {
    "& ul": {
      width: "136px",
      borderRadius: "5px",
      backgroundColor: "#26252E !important",
      padding: "10px 30px 10px 10px",
      boxShadow: "0px 0px 44px 0px #00000080",

      "& li": {
        display: "flex",
        alignItems: "center",
        fontFamily: "Roboto Condensed",
        fontWeight: "400",
        lineHeight: "26px",
        fontSize: "16px",
        color: "#FFFFFF99",
        "&:hover": {
          background: "#26252e",
          color: "#fff",
        },
        "& a": {
          fontSize: "15px",
          fontFamily: "'Roboto', sans-serif",
          fontWeight: "500",
          color: "#B7B7B7",
          "& .active": {
            color: "#fff",
          },
          "&:hover": {
            color: "#fff",
          },
        },
      },
    },
  },
  menuButton: {
    fontSize: "14px",
    lineHeight: "21px",
    fontWeight: "800",
    background: "linear-gradient(180deg, #FFFFFF 0%, #ffffffcf 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    padding: "0px 9px",
    marginLeft: "3px",
    textTransform: "uppercase",
    textDecoration: "none",
    fontFamily: "Sora, sans-serif",
    "@media (max-width: 900px)": {
      padding: "15px !important",
      width: "100%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    "& .active": {
      background:
        "linear-gradient(93.34deg, #FF6F37 6.82%, #FF2676 35.9%, #B801AA 68.08%, #7101BC 101.4%)",
      textShadow: "3px 3px 3px rgb(0 0 0 / 13%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    "&:hover": {
      background:
        "linear-gradient(93.34deg, #FF6F37 6.82%, #FF2676 35.9%, #B801AA 68.08%, #7101BC 101.4%)",
      textShadow: "3px 3px 3px rgb(0 0 0 / 13%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
  },

  toolbar: {
    // height: "100%",
    display: "flex",
    padding: "8px 0px",
    justifyContent: "space-between",
    // background: "#00000080",
    // borderRadius: "50px",
    // marginTop: "20px",
    // "@media (max-width: 900px)": {
    //   paddingLeft: "75px",
    //   paddingRight: "20px",
    //   height: "100%",
    // },
  },

  drawerContainer: {
    padding: "20px 0px ",
    height: "100%",
    background: "#000",
    width: "260px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  drawericon: {
    color: "#000",
    position: "absolute",
    top: "0px",
    right: "-10px",
    fontSize: "25px",
    display: "flex",
  },
  logoImg: {
    width: "130px",
    // height: '44.5px',
    // margin: " 14px 15px 11px 0px",
    objectFit: "contain",
    "@media (max-width: 500px)": {
      margin: " 11px 1px 3px 0px",
      width: "100px",
    },
  },
  menuMobile: {
    fontSize: "14px !important",
    fontWeight: "400",
    fontStyle: "normal",
    // letterSpacing: "-0.6px",
    lineHeight: "1.75",
    color: "#fff",
    width: "100%",
    // background: "rgba(255, 255, 255, 0.05)",
    // borderBottom: "1px solid #3e3e3e",
    padding: "5px 5px",
    "@media (max-width: 600px)": {
      width: "100%",
      fontSize: "14px",
      display: "flex",
      justifyContent: "center",
      // background: "rgba(255, 255, 255, 0.05)",
      padding: "7px 0px",
    },
  },

  containerHeight: {
    height: "100%",
    "& .activeButton": {
      background:
        "linear-gradient(93.34deg, #FF6F37 6.82%, #FF2676 35.9%, #B801AA 68.08%, #7101BC 101.4%)",
      textShadow: "3px 3px 3px rgb(0 0 0 / 13%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    "& .MuiMenu-paper": {
      top: "0px !important",
    },
  },
  mainHeader: {
    justifyContent: "space-between",
    padding: "0px",
  },

  drawerPaper: {
    width: "100%",
    height: "100%",
  },
  IconButtonBox: {
    position: "absolute",
    top: "0",
    right: "0",
  },
  sidebarBox: {
    maxWidth: "400px",
    width: "100%",
    padding: "10px",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "355px",
    },
  },
}));

const StyledMenu = withStyles({
  paper: {
    marginTop: "20px",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

export default function Header() {
  const {
    menuMobile,
    toolbar,
    menubox,
    drawerContainer,
    drawericon,
    sidebarBox,
    containerHeight,
    mainHeader,
  } = useStyles();
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open11, setOpen11] = React.useState(false);
  const auth = useContext(AuthContext);
  const [disconnect, setDisconnect] = useState(false);
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });
  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 1220
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
  }, []);

  const checkLoginCondition = true;
  // auth.adminUserData.userType === "ADMIN"
  //   ? auth.account === auth.contractDetails.owner
  //   : auth.account === auth.adminUserData.walletAddress;

  const loginSubmit = async (values) => {
    try {
      const response = await apiRouterCall({
        method: "PUT",
        endPoint: "editProfile",
        bodyData: {
          ibiName: values.IBIName,
          ibiId: values.IBIId,
        },
      });

      if (response?.data?.responseCode === 200) {
        auth.setisibiRequire(false);
        toast.success(response?.data?.responseMessage);
      } else {
        toast.error(response?.data?.responseMessage);
        auth.setisibiRequire(false);
      }
    } catch (err) {
      console.log(" err ", err);
    }
  };
  const initialFormValues = {
    IBIName: "",
    IBIId: "",
  };
  const validationFormSchema = yup.object().shape({
    IBIId: yup.string().trim().required("IBI Id is required."),
    IBIName: yup.string().trim().required("IBI Name is required."),
  });

  const connectWalletButton = (
    <Button
      variant="contained"
      color="secondary"
      className="connectButton"
      style={{ marginLeft: "17px", padding: "15px" }}
      onClick={(event) =>
        !auth.account
          ? auth.setOpenMetamask(true)
          : setAnchorEl(event.currentTarget)
      }
      endIcon={
        auth.account && <IoIosArrowDown style={{ marginLeft: "-5px" }} />
      }
    >
      {auth.account ? sortAddress(auth.account) : "Connect Wallet"}
    </Button>
  );

  const femmecubatorLogo = (
    <Box>
      <Link to="/">
        <Logo className={classes.logoImg} />
      </Link>
    </Box>
  );

  const getMenuButtons = () => {
    return headersData
      .filter((item) => (item.label === "Login" ? checkLoginCondition : item))
      .map(({ label, href }) => {
        return (
          <Button
            className={`${classes.menuButton} ${
              window.location.pathname === href && "activeButton"
            }`}
            onClick={() => history.push(`${href}`)}
          >
            {label}
          </Button>
        );
      });
  };

  const displayDesktop = () => {
    return (
      <Toolbar className={toolbar}>
        {femmecubatorLogo}
        <Grid
          container
          item
          direction="row"
          justify="flex-end"
          alignItems="center"
          style={{ paddingLeft: "0px" }}
        >
          {getMenuButtons()}
          {connectWalletButton}
        </Grid>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar className={mainHeader}>
        <Hidden xsDown>
          <Drawer
            {...{
              anchor: "right",
              open: drawerOpen,
              onClose: handleDrawerClose,
            }}
          >
            <div className={drawerContainer}>
              {femmecubatorLogo}
              {getDrawerChoices()}
              {connectWalletButton}
            </div>
          </Drawer>
        </Hidden>
        <Hidden smUp>
          <SwipeableDrawer
            {...{
              anchor: "bottom",
              open: drawerOpen,
              onClose: handleDrawerClose,
            }}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={drawerContainer}>
              <div className={classes.IconButtonBox}>
                <IconButton onClick={() => handleDrawerClose()}>
                  <RxCross2 />
                </IconButton>
              </div>
              {femmecubatorLogo}
              {getDrawerChoices()}
              {connectWalletButton}
            </div>
          </SwipeableDrawer>
        </Hidden>

        <div>{femmecubatorLogo}</div>
        <Grid container>
          <Grid item xs={6}></Grid>
          <Grid item xs={4}>
            <Box className={drawericon}>
              <Box
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  display: "none",
                }}
                // onClick={handleClick}
                mr={1}
              >
                <Avatar src="images/mgpro.png" />
                <AiFillCaretDown style={{ color: "#fff", fontSize: "15px" }} />
              </Box>
              <IconButton
                {...{
                  edge: "start",
                  color: "inherit",
                  "aria-label": "menu",
                  "aria-haspopup": "true",
                  onClick: handleDrawerOpen,
                }}
              >
                <MenuIcon
                  width="60px"
                  height="60px"
                  style={{ color: "#ff2676", fontSize: "30px" }}
                />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    );
  };

  const getDrawerChoices = () => {
    return headersData
      .filter((item) => (item.label === "Login" ? checkLoginCondition : item))
      .map(({ label, href }) => {
        return (
          <Button
            // {...{
            //   key: label,
            //   color: "inherit",
            //   to: href,
            //   component: Link,
            // }}
            onClick={() => history.push(`${href}`)}
          >
            <MenuItem className={menuMobile}>{label}</MenuItem>
          </Button>
        );
      });
  };

  return (
    <AppBar
      position={window.location.pathname !== "/" ? "relative" : "absolute"}
      elevation={0}
      style={{ backgroundColor: "#100F10", border: "none" }}
    >
      <Container maxWidth="lg" className={containerHeight}>
        {mobileView ? displayMobile() : displayDesktop()}
        <StyledMenu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          className={menubox}
          onClose={(e) => setAnchorEl(null)}
        >
          <MenuItem onClick={() => history.push("/profile")}>
            <img
              src="/images/profileUser.svg"
              alt="User"
              width="20px"
              height="20px"
            />
            &nbsp; Profile
          </MenuItem>
          {/* <MenuItem  onClick={() => setOpen11(true)}>
              Announcements
            </MenuItem> */}
          <MenuItem
            onClick={() => {
              setDisconnect(true);
              setAnchorEl(null);
            }}
          >
            <img
              src="/images/disconnect.svg"
              alt="Disconnect"
              width="20px"
              height="20px"
            />
            &nbsp; Disconnect
          </MenuItem>
        </StyledMenu>
      </Container>

      {auth.openMetamask && (
        <ConnectModal
          handleCloseModal={() => auth.setOpenMetamask(false)}
          openModal={auth.openMetamask}
          auth={auth}
        />
      )}
      {disconnect && (
        <ConfirmationDialogBox
          openModal={disconnect}
          handleClose={() => setDisconnect(false)}
          heading="Disconnect"
          description={`Are you sure you want to disconnect wallet?`}
          HandleConfirm={() => {
            auth.disconnectWalletHandler();
            setDisconnect(false);
          }}
          isLoading={false}
        />
      )}

      <Drawer
        variant="temporary"
        anchor="right"
        open={open11}
        onClose={() => setOpen11(false)}
        style={{ overflowY: "scroll" }}
      >
        <Box className={sidebarBox} style={{}}>
          <Box>
            <IconButton
              style={{ position: "absolute", top: "0px", right: "5px" }}
              onClick={() => setOpen11(false)}
            >
              <IoClose style={{ color: "#fff" }} />
            </IconButton>
          </Box>
          <Box align="center" py={2}>
            <Typography variant="h4">Announcements</Typography>
          </Box>
          <Grid container>
            <Grid item xs={12}>
              {announcement.map(() => (
                <AnnouncementCard />
              ))}
            </Grid>
          </Grid>
          <Box align="right">
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "10px 0px" }}
              onClick={() => history.push("/view-all-announcement")}
            >
              View More
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Dialog
        maxWidth="sm"
        fullWidth
        className={classes.dailogOpen}
        open={auth.isibiRequire}
        keepMounted
      >
        <Box className="newModalBorder">
          <Box className="mainbox1">
            <DialogContent>
              <Box className={classes.dialougTitle} align="center">
                <Formik
                  initialValues={initialFormValues}
                  validationSchema={validationFormSchema}
                  onSubmit={loginSubmit}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    touched,
                    values,
                    setFieldValue,
                  }) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box mb={1} textAlign={"start"}>
                            <Typography variant="body2">
                              IBI Name{" "}
                              <span style={{ color: "#FD3124" }}>*</span>
                            </Typography>
                          </Box>

                          <FormControl fullWidth className="formControl">
                            <TextField
                              variant="outlined"
                              placeholder="Please enter IBI Name"
                              fullWidth
                              name="IBIName"
                              value={values.IBIName}
                              error={Boolean(touched.IBIName && errors.IBIName)}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            <FormHelperText error>
                              {touched.IBIName && errors.IBIName}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Box mb={1} textAlign={"start"}>
                            <Typography variant="body2">
                              IBI Id <span style={{ color: "#FD3124" }}>*</span>
                            </Typography>
                          </Box>

                          <FormControl fullWidth className="formControl">
                            <TextField
                              type="text"
                              name="IBIId"
                              variant="outlined"
                              placeholder="Please enter IBI Id"
                              fullWidth
                              value={values.IBIId}
                              error={Boolean(touched.IBIId && errors.IBIId)}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            <FormHelperText error>
                              {touched.IBIId && errors.IBIId}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Box mt={2}>
                        <Button
                          variant="contained"
                          color="secondary"
                          className="transparentbutton"
                          type="submit"
                        >
                          Confirm
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Box>
            </DialogContent>
          </Box>
        </Box>
      </Dialog>
    </AppBar>
  );
}
