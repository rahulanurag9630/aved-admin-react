import React from "react";
import {
  makeStyles,
  Box,
  Typography,
  Grid,
  Container,
} from "@material-ui/core";
import { capitalizeFirstLetter } from "src/utils";

const useStyles = makeStyles((theme) => ({
  CarDetail: {
    "& h6": {
      color: "#959595",
      position: "relative",
      zIndex: "1",
    },
    "& p": {
      color: "#959595",
      fontSize: "16px",
      fontWeight: "400",
      textAlign: "left",
    },
    "& .detailBox": {
      marginTop: "8px",
      background:
        "linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)",
      // boxShadow: "0px 0px 53px rgba(0, 0, 0, 0.25)",

      boxShadow: "0 0 10px 5px rgba(0, 0, 255, 0.1)",
      backdropFilter: "blur(21px)",
      width: "100%",
      height: "50px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      justifyContent: "center",
      position: "relative",

      "&:hover": {
        boxShadow:
          "0 2px 0 0 #ec0066, 0 -1px 0 0 #7e46a1, 2px 0 0 0 #7101bc, -2px 0 0 0 #ff4237, 1px 1px 0 0 #ec0066, -2px 2px 0 0 #ec0066, 2px 1px 0 0 #ec0066, -1px -2px 0 0 #ec0066",
      },

      "&:before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        top: "0",
        left: "0",
        background:
          "radial-gradient(54.8% 53% at 50% 50%, #151515 0%, rgba(21, 21, 21, 0) 100%) ,\nradial-gradient(60% 51.57% at 50% 50%, #0938DF 0%, rgba(9, 56, 223, 0) 100%) ,\nradial-gradient(69.43% 69.43% at 50% 50%, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
      },
      "&:after": {
        content: "'' ",
        position: "absolute",

        inset: "2px",
        background:
          "linear-gradient(152.97deg, rgb(117 117 117) 0%, rgb(17 17 17) 100%)",
      },
      "& h6": {
        color: "#FAFFFF",
        fontWeight: "300",
        fontSize: "13px",
      },
    },
  },

  marginTopBox: {
    marginTop: "42px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "380px",
    },
    // [theme.breakpoints.down("xs")]: {
    //   marginTop: "319px",
    // },
  },
}));

const CommenGeragDetails = ({ commonPropsData }) => {
  const classes = useStyles();

  const vehicleSpeciArray = [
    {
      heading: commonPropsData?.locationData?.playGameAsset
        ? capitalizeFirstLetter(commonPropsData?.locationData?.playGameAsset)
        : "Avatar",
      value:
        commonPropsData?.nftListData[commonPropsData?.currentIndexValue]?.color,
    },
    {
      heading: "Standards",
      value:
        commonPropsData?.nftListData[commonPropsData?.currentIndexValue]
          ?.carType === "FOURWHEELER"
          ? "4X4"
          : "RWD",
    },
    {
      heading: "Generated",
      value:
        commonPropsData?.nftListData[commonPropsData?.currentIndexValue]
          ?.motorTorque,
    },
  ];

  return (
    <Container maxWidth="sm">
      <Box mt={4} className={classes.marginTopBox}>
        <Grid container spacing={2}>
          {vehicleSpeciArray?.map((data, i) => {
            return (
              <Grid item xs={6} lg={4} md={4} sm={4}>
                <Box className={classes.CarDetail}>
                  <Typography variant="body2">{data?.heading}:</Typography>
                  <Box className="detailBox">
                    <Typography variant="h6">{data?.value || "..."}</Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
};

export default React.memo(CommenGeragDetails);
