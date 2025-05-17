import React, { useEffect, useRef } from "react";
import { makeStyles, Box } from "@material-ui/core";
import Slider from "react-slick";

const useStyles = makeStyles((theme) => ({
  raceMainBox: {
    position: "relative",
    marginTop: "120px",
    [theme.breakpoints.down("xs")]: {
      marginTop: "65px",
    },
    "& .slick-initialized .slick-slide": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& .topslickslider1 .slick-prev": {
      left: "-16px !important",
      bottom: "-9px !important",
      top: "auto !important",
      right: "auto !important",
      [theme.breakpoints.down("md")]: {
        left: "-25px !important",
        bottom: "75px !important",
      },
      [theme.breakpoints.down("sm")]: {
        left: "-20px !important",
      },
      [theme.breakpoints.down("xs")]: {
        left: "-20px !important",
        bottom: "6px !important",
      },
    },
    "& .topslickslider1 .slick-next": {
      top: "auto !important",
      bottom: "-17px !important",
      left: "auto !important",
      right: "-9px !important",
      [theme.breakpoints.down("md")]: {
        right: "-25px !important",
        bottom: "75px !important",
      },
      [theme.breakpoints.down("sm")]: {
        right: "-20px !important",
      },
      [theme.breakpoints.down("xs")]: {
        right: "-20px !important",
        bottom: "6px !important",
      },
    },
    "& .bottomimg": {
      width: "auto",
      maxWidth: "100%",
      position: "relative",
      [theme.breakpoints.down("md")]: {
        maxWidth: "800px",
        width: "100%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "auto",
        maxWidth: "100%",
      },
    },
    "& .Topimg": {
      position: "absolute",
      transform: "translate(-50%,-50%)",
      top: "256%",
      left: "50%",
      width: "auto",
      maxWidth: "100%",
      [theme.breakpoints.down("xl")]: {
        top: "123px",
      },
      [theme.breakpoints.down("md")]: {
        top: "0px",
      },
      [theme.breakpoints.down("sm")]: {
        maxWidth: "140px",
        width: "100%",
      },
      [theme.breakpoints.down("xs")]: {
        maxWidth: "80px",
        width: "100%",
      },
    },
  },
}));

const CommonSelectAsset = ({ passProps }) => {
  const classes = useStyles();
  const sliderRef = useRef(null);
  const settings = {
    dots: false,
    slidesToShow: 1,
    arrows: true,
    centerMode: false,
    centerPadding: "0px",
    className: "recomended",
    autoplaySpeed: 5000,
    infinite: true,
    afterChange: (current) =>
      current >= 0 && passProps?.setCurrentIndex(current),

    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 1,
          arrows: true,
          centerMode: false,
          centerPadding: "50px",
        },
      },
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 1,
          arrows: true,
          centerMode: false,
          centerPadding: "50px",
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          arrows: true,
          centerMode: false,
          centerPadding: "50px",
        },
      },

      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          arrows: true,
          centerMode: false,
          centerPadding: "10px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          arrows: true,
          centerMode: false,
          centerPadding: "10px",
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          arrows: true,
          centerPadding: "10px",
        },
      },
    ],
  };

  useEffect(() => {
    sliderRef.current &&
      sliderRef.current.slickGoTo(passProps?.currentIndexValue);
  }, [passProps?.currentIndexValue]);

  return (
    <Box className={classes.raceMainBox}>
      <img alt="" src="images/racestage.png" className="bottomimg" />
      <Slider
        {...settings}
        ref={sliderRef}
        style={{ width: "100%" }}
        className="Topimg topslickslider1"
      >
        {passProps?.nftListData &&
          passProps?.nftListData.map((data, index) => {
            return (
              <div className="" key={index} style={{ height: "250px" }}>
                <img alt="" src={data.image} />
              </div>
            );
          })}
      </Slider>
    </Box>
  );
};

export default CommonSelectAsset;
