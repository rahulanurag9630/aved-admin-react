import React from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { AnimationOnScroll } from "react-animation-on-scroll";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "fit-content",
    position: "relative",
    "& .TopRightVector": {
      top: "-10px",
      right: "-19px",
      width: "60%",
      position: "absolute",
      height: "3px",
    },
    "& h5": {
      fontSize: "20px",
      fontWeight: "700",
    },
    "& h2": {
      fontSize: "40px",
      fontWeight: "700",
    },
    "& .BottomLeftVector": {
      width: "70%",
      position: "absolute",
      bottom: "-10px",
      left: "-45px",
      height: "3px",
    },
    "& .HeadingImage": {
      position: "absolute",
      bottom: "-15px",
      right: "0px",
      width: "42px",
    },
  },
}));

const HeadingComponent = ({ title }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      {title === "ENVIRONMENT" && (
        <Typography variant="h5" style={{ position: "absolute", top: "-25px" }}>
          MULTIPLE
        </Typography>
      )}
      <AnimationOnScroll animateIn="animate__fadeInRight">
        <img
          src="images/TopRightVector.png"
          className="TopRightVector"
          alt=""
        />
      </AnimationOnScroll>

      <Typography variant="h2">{title}</Typography>

      <AnimationOnScroll animateIn="animate__lightSpeedInLeft">
        <img
          src="images/BottomLeftVector.png"
          className="BottomLeftVector"
          alt=""
        />
      </AnimationOnScroll>
      <AnimationOnScroll animateIn="animate__shakeX">
        <img src="images/HeadingImage.png" className="HeadingImage" alt="" />
      </AnimationOnScroll>
    </Box>
  );
};

export default HeadingComponent;
