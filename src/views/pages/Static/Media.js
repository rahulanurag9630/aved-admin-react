import React from "react";
import {
  makeStyles,
  Typography,
  Box,
  Container,
  Grid,
} from "@material-ui/core";
import Gallerycard from "./Gallerycard";
import { AnimationOnScroll } from "react-animation-on-scroll";

const useStyles = makeStyles((theme) => ({
  root: {
    // userSelect: "none",
    padding: "80px 0px 75px",
    "& h3": {
      color: "#00FFFF",
    },
    "& h6": {
      color: "#959595",
    },
  },
  mainBox: {
    position: "relative",
    backgroundImage: "url(images/BigNewsBackgroundImage.png)",
    backgroundPosition: "center bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    padding: "150px 0 64px 30px",
    border: "0.25px solid #0b2844",
    borderTopRightRadius: "15px",
    borderBottomLeftRadius: "15px",
    zIndex: "1",
    "&::before": {
      content: "''",
      position: "absolute",
      left: "0",
      bottom: "0",
      display: "block",
      width: "100%",
      height: "100%",
      zIndex: "-1",
      borderTopRightRadius: "15px",
      borderBottomLeftRadius: "15px",
      background:
        "linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)",
      boxShadow: "0px 0px 53px rgba(0, 0, 0, 0.25)",
    },
    [theme.breakpoints.down("md")]: {
      height: "auto",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "17px",
    },
    "& .imageBox": {
      position: "absolute",
      top: "-80px",
      right: "0px",
    },
    "& .textBox": {
      "& h4": {
        padding: "10px 0px",
        fontSize: "22px",
        fontWeight: "600",
        [theme.breakpoints.down("xs")]: {
          fontSize: "25px",
        },
      },
      "& h3": {
        padding: "10px 0px",
        [theme.breakpoints.down("xs")]: {
          fontSize: "25px",
        },
      },
      "& h6": {
        padding: "10px 0px",
        color: "#FAFFFF",
        [theme.breakpoints.down("xs")]: {
          fontSize: "15px",
        },
      },
      "& .subscribeBox": {
        marginTop: "15px",
        display: "flex",
        alignItems: "center",
      },
      "& p": {
        lineHeight: "23px",
      },
      "& span": {
        color: "#00FFFF",
      },
    },
  },
  subscribeButton: {
    backgroundColor: "#00FFFF",
    color: "#ffffff",
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "18px",
    padding: "0px 25px",
    height: "45px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    },
    "&:hover": {
      backgroundColor: "#00FFFF",
    },
  },
  racingmainBox: {
    border: "1px solid #0b2844b8",
    padding: "40px",
    zIndex: "1",
    position: "relative",
    backgroundSize: "cover",
    backgroundImage: "url(images/racing.png)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center bottom",
    borderRadius: "23px",
    height: "40vh",
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      top: "0",
      left: "0",
      background: "transparent",
      borderRadius: "23px",
    },
    [theme.breakpoints.down("md")]: {
      //   height: "auto",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "17px",
    },
    "& .textBox": {
      padding: "0px 15px",
      "& h4": {
        padding: "10px 0px",
        fontSize: "22px",
        fontWeight: "600",
        [theme.breakpoints.down("xs")]: {
          fontSize: "20px",
        },
      },
      "& h3": {
        padding: "10px 0px",
        [theme.breakpoints.down("xs")]: {
          fontSize: "20px",
        },
      },
      "& h6": {
        padding: "10px 0px",
        color: "#FAFFFF",
        [theme.breakpoints.down("xs")]: {
          fontSize: "15px",
        },
      },
    },
  },
}));

const gallerydata = [
  {
    image: "images/carhd1.png",
  },
  {
    image: "images/carhd1.png",
  },
  {
    image: "images/carhd1.png",
  },
  {
    image: "images/carhd1.png",
  },
  {
    image: "images/carhd1.png",
  },
  {
    image: "images/carhd1.png",
  },
];

function Media() {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.root}>
        <Container maxWidth="lg">
          <Box className={classes.racingmainBox}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={5}>
                <Box className="textBox" mb={3}>
                  <AnimationOnScroll animateIn="animate__fadeInUp">
                    <Typography variant="h4">Start Racing Today!</Typography>

                    <Typography variant="body2">
                      Start your racing career with multiple enjoyment by
                      purchasing a vehicle.
                    </Typography>
                  </AnimationOnScroll>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={7}></Grid>
            </Grid>
          </Box>
          {/* 
          <Container>
            <Box mt={4}>
              <Box className="textBox" align="center" mt={7} mb={7}>
                <Typography variant="h3" style={{ color: "#fff" }}>
                  Logo
                </Typography>
              </Box>
              <Grid container spacing={4} style={{ justifyContent: "center" }}>
                {playersdata &&
                  playersdata?.map((data, index) => {
                    return (
                      <Grid item xs={12} sm={4} md={2} lg={3}>
                        <LogoCard data={data} index={index} type="catd" />
                      </Grid>
                    );
                  })}
              </Grid>
            </Box>
          </Container> */}

          <Box mt={7} mb={7}>
            <Box className="textBox" align="center" mt={7} mb={7}>
              <Typography variant="h3" style={{ color: "#fff" }}>
                Gallery
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {gallerydata &&
                gallerydata?.map((data, index) => {
                  return (
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <Gallerycard data={data} index={index} type="catd" />
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Media;
