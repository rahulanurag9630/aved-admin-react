import React, { useContext } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  makeStyles,
  IconButton,
  Typography,
  SvgIcon,
  Toolbar,
  AppBar,
  Hidden,
  Avatar,
  Grid,
  Box,
} from "@material-ui/core";
import { Menu as MenuIcon } from "react-feather";
import { Link } from "react-router-dom";
import { AuthContext } from "src/context/Auth";
import Logo from "src/component/Logo";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    padding: "7px 30px 7px 30px",
    background: "#5c4d44",
    [theme.breakpoints.down("sm")]: {
      padding: "0px 20px 0px 20px",
    },
  },
  logo: {
    marginRight: theme.spacing(2),
  },
  link: {
    fontWeight: theme.typography.fontWeightMedium,
    "& + &": {
      marginLeft: theme.spacing(2),
    },
  },
  divider: {
    width: 1,
    height: 32,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  mainheader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",

    "& svg": {
      color: theme.palette.text.primary,
    },
    "& .leftBox": {
      width: "306px",
      marginLeft: "-7px",
      [theme.breakpoints.down("md")]: {
        width: "200px",
      },
      [theme.breakpoints.down("xs")]: {
        width: "150px",
      },
      "& img": {
        width: "100px",
        [theme.breakpoints.down("xs")]: {
          width: "104px",
          paddingLeft: "0 !important",
        },
      },
    },
  },
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  return (
    <AppBar
      elevation={0}
      className={clsx(classes.root, className)}
      color="inherit"
      // style={{
      //   boxShadow: "0px 4px 4px rgb(0 0 0 / 10%)",
      // }}
      {...rest}
    >
      <Toolbar className={classes.toolbar}>
        {/* <Hidden lgUp>
          <IconButton
            color="#00e0b0"
            onClick={onMobileNavOpen}
            style={{ padding: "0px" }}
          >
            <SvgIcon>
              <MenuIcon style={{ color: "#FF0098", fontSize: "25px" }} />
            </SvgIcon>
          </IconButton>
        </Hidden> */}
        <Box className="mobileButton">
          <IconButton onClick={onMobileNavOpen} style={{ padding: "0px" }}>
            <MenuIcon style={{ color: "#6938EF", fontSize: "25px" }} />
          </IconButton>
        </Box>
        &nbsp; &nbsp;
        <Box className={classes.mainheader}>
          <Grid container alignItems="center">
            <Grid item lg={3} md={3} sm={4} xs={6}>
              <Box className="leftBox">
                <Link to="/">
                  <img src="/images/logo.png" width="60px" height={"60px"} />
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
};
TopBar.defaultProps = {
  onMobileNavOpen: () => { },
};

export default TopBar;

export function TopBarData() {
  const classes = useStyles();
  const auth = useContext(AuthContext);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <Hidden xsDown>
          <Box>
            <Typography variant="h5">NFT Marketplace</Typography>
            <Typography variant="body1" style={{ color: "#ffffff9c" }}>
              example@gmail.com
            </Typography>
          </Box>
        </Hidden>
        &nbsp; &nbsp;
        <Avatar
          src={
            auth?.userData?.profilePic
              ? `${auth?.userData?.profilePic}`
              : "https://picsum.photos/533/357"
          }
          className={classes.avatar}
        />
      </Box>
    </>
  );
}
