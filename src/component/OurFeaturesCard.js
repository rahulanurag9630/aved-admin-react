import React from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  productCardBox: {
    border: "1px solid #394148",
    padding: "52px 37px 15px",
    zIndex: "9",
    position: "relative",
    background:
      "linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)",
    minHeight: "293px",
    textAlign: "center",
    borderRadius: "5px",
    "@media(max-width:1200px)": {
      minHeight: "340px",
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: "293px",
    },
    "&::before": {
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      content: "''",
      zIndex: "-1",
      position: "absolute",
      backdropFilter: "blur(21px)",
      borderRadius: "5px",
    },

    "&:hover": {
      boxShadow:
        "0 2px 0 0 #ec0066, 0 -1px 0 0 #7e46a1, 2px 0 0 0 #7101bc, -2px 0 0 0 #ff4237, 1px 1px 0 0 #ec0066, -2px 2px 0 0 #ec0066, 2px 1px 0 0 #ec0066, -1px -2px 0 0 #ec0066",
    },
    "& figure": {
      // margin: "0px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      width: "initial",
      height: "85px",
      margin: "0 auto",
    },
    "& h5": {
      height: "80px",
      margin: "24px 0px 4px",
      display: "flex",
      fontSize: "17px",
      alignItems: "center",
      fontWeight: "700",
      lineHeight: "22px",
    },
  },
}));

const OurFeaturesCard = (props) => {
  const { data } = props;
  const classes = useStyles();

  return (
    <Box className={classes.productCardBox}>
      <Box className="productinnerBox" align="center">
        <figure>
          <img
            src={data?.image}
            alt={"data?.title"}
            style={{ pointerEvents: "none", userSelect: "none" }}
          />
        </figure>
        <Box align="center">
          <Typography variant="h5">{data?.title}</Typography>
        </Box>

        <Typography variant="body2">{data?.description}</Typography>
        <Typography variant="body2" style={{ marginTop: "5px" }}>
          {data?.description1}
        </Typography>
        {/* <Typography variant="body2" style={{ marginTop: "5px" }}>
          {data?.description2}
        </Typography> */}
      </Box>
    </Box>
  );
};

export default OurFeaturesCard;
