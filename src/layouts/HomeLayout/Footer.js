import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  makeStyles,
  IconButton,
} from "@material-ui/core";
import { AiOutlineMedium } from "react-icons/ai";
import { FaInstagram, FaFacebookF, FaTelegramPlane } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import Logo from "src/component/Logo";
import { useHistory } from "react-router-dom";
import { apiRouterCall } from "src/ApiConfig/service";
import { FaXTwitter } from "react-icons/fa6";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    padding: "30px 0px 20px",
    background: "#110E10",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "& .vectorImage": {
      position: "absolute",
      right: "7%",
      top: "5%",
      width: "100%",
      maxWidth: "250px",
    },
    "& .mainBox": {
      position: "relative",
      zIndex: "999",

      "& .IconsBox": {
        padding: "48px 0px 43px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        "& .MuiIconButton-root": {
          padding: "0px",
          "&:hover": {
            background: "#110e10 !important",
            "& svg": {
              color: "#ff2676",
            },
          },
        },
        "& .icon": {
          width: "14px",
          height: "25px",
        },
        "& svg": {
          fontSize: "30px",
        },
      },
      "& .footerLinkPages": {
        display: "flex",
        alignItems: "center",
        "& p": {
          fontSize: "13px",
          textTransform: "uppercase",
          color: "#FFFFFF",
          fontWeight: "100",
        },
        justifyContent: "center",
        position: "relative",
        flexWrap: "wrap",
        paddingBottom: "30px",
        borderBottom: "1px solid #323232",
        "& h4": {
          padding: "15px 0px",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          "& span": {
            cursor: "pointer",
            display: "flex",
            width: "max-content",
          },
        },
      },
    },
  },
  logoImg: {
    width: "150px",
    objectFit: "contain",
    "@media (max-width: 500px)": {
      width: "100px",
    },
  },
}));

export default function Footer() {
  const classes = useStyles();
  const history = useHistory();
  const [staticData, setStaticData] = useState([]);
  useEffect(() => {
    getHandleStatic();
  }, []);
  const getHandleStatic = async () => {
    try {
      const response = await apiRouterCall({
        endPoint: `staticContentList`,
      });
      if (response?.data?.responseCode === 200) {
        setStaticData(response.data.result);
      } else {
        setStaticData("");
      }
    } catch (err) {
      setStaticData("");
      console.log(" err ", err);
    }
  };
  return (
    <>
      <Box className={classes.root}>
        <Container maxWidth="lg">
          <Box className="mainBox">
            <Box align="center">
              <RouterLink to="/">
                <Logo className={classes.logoImg} />
              </RouterLink>
            </Box>
            <Box className="IconsBox">
              <IconButton target="_blank" href="https://www.facebook.com/">
                <FaFacebookF />
              </IconButton>
              <IconButton target="_blank" href="https://telegram.org/">
                <FaTelegramPlane />
              </IconButton>
              <IconButton
                target="_blank"
                href="https://www.instagram.com/fieresofficial/?igshid=YmMyMTA2M2Y%3D"
              >
                <FaInstagram />
              </IconButton>
              <IconButton target="_blank" href="https://t.me/+YEuUrv0Hw0s0NmE0">
                <FaXTwitter />
              </IconButton>
              <IconButton target="_blank" href="https://medium.com/">
                <AiOutlineMedium />
              </IconButton>
            </Box>
            <Box className="footerLinkPages">
              {/* <Typography variant="h4">
                <span onClick={() => history.push("/about")}>About</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span onClick={() => history.push("/media")}>Media</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span >Privacy</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span >
                  Terms and Conditions
                </span>
              </Typography> */}
              {/* <Box mx={2} style={{ cursor: "pointer" }}>
                <Typography
                  variant="body1"
                  onClick={() => history.push("/about")}
                >
                  About
                </Typography>
              </Box> */}
              {/* <Box mx={2} style={{ cursor: "pointer" }}>
                <Typography
                  variant="body1"
                  onClick={() => history.push("/media")}
                >
                  Media
                </Typography>
              </Box> */}
              {/* <Box mx={2} style={{ cursor: "pointer" }}>
                <Typography
                  variant="body1"
                  onClick={() => history.push("/privacy")}
                >
                  Privacy
                </Typography>
              </Box> */}
              {staticData &&
                staticData.map((maps) => {
                  return (
                    <Box mx={2} style={{ cursor: "pointer" }}>
                      <Typography
                        variant="body1"
                        onClick={() =>
                          history.push({
                            pathname: "/terms",
                            search: maps.type,
                          })
                        }
                      >
                        {" "}
                        {maps.title}
                      </Typography>
                    </Box>
                  );
                })}
            </Box>

            <Box align="center" mt={2}>
              <Typography variant="body1" style={{ color: "#959595" }}>
                Copyright © 2024 FIEREX, ALL RIGHTS RESERVED
              </Typography>
            </Box>
          </Box>
        </Container>
        <img
          src="images/FooterVector.png"
          alt="Footer Vector"
          className="vectorImage"
        />
      </Box>
    </>
  );
}
