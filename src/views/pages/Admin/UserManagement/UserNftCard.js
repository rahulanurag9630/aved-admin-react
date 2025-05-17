import React, { useEffect } from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  mainimg: {
    width: "100%",
    overflow: "hidden",
    height: "160px !important",
    minHeight: "160px !important",
    position: "relative",
    backgroundPosition: "center !important",
    backgroundSize: "cover !important",
    backgroundRepeat: " no-repeat !important",
    borderRadius: "20px",
    // filter: "blur(30px)",
    // backgroundColor: "#ccc !important",
    pointerEvents: "none",
    "& .MuiDivider-root": {
      backgroundColor: "#9595954d !important",
    },
  },
  mainimg1: {
    // width: "100%",
    overflow: "hidden",
    // minHeight: "322px !important",
    height: "327px !important",
    position: "relative",
    backgroundPosition: "center !important",
    backgroundSize: "cover !important",
    backgroundRepeat: " no-repeat !important",
    borderRadius: "20px",
    // backgroundColor: "rgba(255, 255, 255, 0.025) !important",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    "& .MuiDivider-root": {
      backgroundColor: "#9595954d !important",
    },
    "& .shadoweffect": {
      position: "absolute",
      // boxShadow: "0px 0px 20px #EB4AED",
      backgroundImage:
        "radial-gradient(36.67% 9.68% at 67.26% 8.27%, rgb(251, 1, 154) 0%, rgb(251, 1, 154) 95.78%)",
      opacity: 0.55,
      filter: "blur(75px)",
      width: "150px",
      height: "65px",
      // zIndex: "999",
      borderRadius: "100px",
      top: "85px",
      left: "22%",
    },
  },

  typo1: {
    marginLeft: "5px",
    fontFamily: "Sora",
    fontSize: "16px",
    fontFeight: 400,
    lineHeight: "20.16px",
  },
}));

const UserNftCard = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { data, index } = props;

  const updateDimensions = () => {
    var offsetWidth = document.getElementById("imagecard" + index).offsetWidth;
    var newoofsetWidth = offsetWidth - 80;
    document.getElementById("imagecard" + index).style.height =
      newoofsetWidth + "px";
  };
  useEffect(() => {
    updateDimensions(); // eslint-disable-next-line
  }, [data, index]);
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
    // eslint-disable-next-line
  }, []);

  const updateDimensions1 = () => {
    var offsetWidth = document.getElementById("imagecard1" + index).offsetWidth;
    var newoofsetWidth = offsetWidth - 100;
    document.getElementById("imagecard1" + index).style.height =
      newoofsetWidth + "px";
  };

  useEffect(() => {
    updateDimensions1(); // eslint-disable-next-line
  }, [data, index]);
  useEffect(() => {
    window.addEventListener("resize", updateDimensions1);
    return () => window.removeEventListener("resize", updateDimensions1); // eslint-disable-next-line
  }, []);

  return (
    <Box
      id={`imagecard1${index}`}
      className={classes.mainimg1}
      style={{
        cursor: "pointer",
        borderRadius: "20px",
        margin: "0px 4px",
      }}
      // onClick={() => history.push("/userlisted-nftdetails")}
      onClick={() => history.push("/listednft-details")}
    >
      <Box className="shadoweffect"></Box>
      <Box
        id={`imagecard${index}`}
        className={classes.mainimg}
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          margin: "38px 0",
        }}
      >
        <img src="images/Garage/garageImage.png" alt="img1" />
      </Box>
      <Box>
        <Box
          textAlign="center"
          mb={2}
          className="displayCenter"
          style={{ gap: "10px", display: "flex", flexDirection: "column" }}
        >
          <Typography variant="h6">{data?.text || "Helloo"}</Typography>
          <Box textAlign="center" className="displayCenter">
            <img src="images/coin.png" alt="coin" />
            <Typography variant="body1" className={classes.typo1}>
              {data?.nftPrice ? data?.nftPrice : "1.5 Fiero"}
            </Typography>
            &nbsp;
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserNftCard;
