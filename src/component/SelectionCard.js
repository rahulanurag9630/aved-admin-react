import React, { useState } from "react";
import { makeStyles, Typography, Box, Button } from "@material-ui/core";
import toast from "react-hot-toast";
import { apiRouterCall } from "src/ApiConfig/service";
import { garageData } from "./GarageCard";
import InfoModal from "src/views/pages/LearnMore/InfoModal";
import {
  capitalizeFirstLetter,
  showAssetValue,
  toSpaceSeparated,
} from "src/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "5px 8px",
    marginTop: "0px",
    cursor: "pointer",
    "& .hoverbox": {
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: 4,
      "&:hover": {
        "& .textBox1": {
          display: "block",
        },
      },
      "& .newnameDetails": {
        position: "absolute",
        bottom: "10px",
        left: "10px",
      },

      "& .newnameDetailssub": {
        position: "absolute",
        bottom: "10px",
        right: "10px",
      },
      "& .garageNameText": {
        width: "99px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        fontFamily: '"Sora", sans-serif',
        fontSize: "14px !important",
        fontWeight: "500",
        textOverflow: "ellipsis",
        color: "#fff",
        textTransform: "uppercase",
      },

      "& .textBox1": {
        top: "-80px",
        left: "3%",
        border: "1px solid #FFFFFF",
        display: "none",
        zIndex: "999",
        position: "absolute",
        borderRadius: "8px",
        padding: "5px 50px",
        [theme.breakpoints.only("xs")]: {
          left: "0",
        },
        "& h5": {
          fontSize: "12px",
        },
        "&::after": {
          content: "''",
          position: "absolute",
          left: "35%",
          top: "100%",
          width: "0",
          height: "0",
          borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent",
          borderTop: "20px solid #e8e8e8",
          clear: "both",
        },
      },
    },
    "& .selectButton": {
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      bottom: "-20%",
      transition: "transform 0.3s ease-in-out",
      display: "none",
    },
    "& .quantityNum": {
      position: "absolute",
      top: "7px",
      left: "10px",
    },
    "& .InfoGarageNum": {
      position: "absolute",
      top: "0",
      right: "10px",
      display: "contents",
      "& button": {
        padding: "0px",
        right: "10px !important",
        top: "10px !important",
        "& img": {
          width: "17px !important",
        },
      },
    },
  },
  mainimg: {
    width: "100%",
    height: "112px !important",
    // overflow: "hidden",
    position: "relative",
    backgroundColor: "#0e0e0e",
    backgroundPosition: "center !important",
    backgroundSize: "cover !important",
    backgroundRepeat: " no-repeat !important",
    borderRadius: "40px 8px 8px 8px",
    zIndex: "1",
    border: "1px solid #626262",
    opacity: "0.24",
    "&:hover": {
      border: "1px solid transparent",
      opacity: "1",
      background: "#0e0e0e",
      boxShadow:
        "0 2px 0 0 #ec0066, 0 -1px 0 0 #7e46a1, 2px 0 0 0 #7101bc, -2px 0 0 0 #ff4237, 1px 1px 0 0 #ec0066, -2px 2px 0 0 #ec0066, 2px 1px 0 0 #ec0066, -1px -2px 0 0 #ec0066",
    },
  },
  carMainBox: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
    background: "#0e0e0e",
    zIndex: "1",
    border: "1px solid #394148",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: "1",
    height: "100%",
    minHeight: "180px",
    borderRadius: "5px",
    marginTop: "20px",
    "& img": {
      maxWidth: "92px",
      width: "100%",
    },
    "& .centerCircle": {
      right: "auto",
      left: "auto",
      top: "52px",
      width: "147px",
      filter: "blur(33px)",
      height: "80px",
      borderRadius: "427px",
      backgroundImage: (props) => props.gradientColor,
    },
    "&:hover": {
      border: "1px solid transparent",
      opacity: "1",
      boxShadow:
        "0 2px 0 0 #ec0066, 0 -1px 0 0 #7e46a1, 2px 0 0 0 #7101bc, -2px 0 0 0 #ff4237, 1px 1px 0 0 #ec0066, -2px 2px 0 0 #ec0066, 2px 1px 0 0 #ec0066, -1px -2px 0 0 #ec0066",

      "& .selectButton": {
        transform: "translate(-50%, -50%)",
        bottom: "25%",
        display: "block",
      },
      "& .templateImage": {
        filter: "brightness(70%)",
      },

      "& .garageNameText": {
        color: "#959595",
      },
    },
  },
  carMainBoxHover: {
    height: "100%",
    minHeight: "154px",
    width: "100%",
    overflow: "hidden",
    position: "relative",
    background: "#0e0e0e",
    zIndex: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: "1",
    border: "1px solid transparent",
    boxShadow:
      "0 2px 0 0 #ec0066, 0 -1px 0 0 #7e46a1, 2px 0 0 0 #7101bc, -2px 0 0 0 #ff4237, 1px 1px 0 0 #ec0066, -2px 2px 0 0 #ec0066, 2px 1px 0 0 #ec0066, -1px -2px 0 0 #ec0066",
    "& img": {
      maxWidth: "92px",
      width: "100%",
    },
    "& .centerCircle": {
      right: "auto",
      left: "auto",
      top: "25px",
      width: "147px",
      filter: "blur(33px)",
      height: "80px",
      borderRadius: "427px",
      backgroundImage: (props) => props.gradientColor,
    },
    "&:hover": {
      "& .selectButton": {
        transform: "translate(-50%, -50%)",
        bottom: "23%",
        display: "block",
      },
      "& .templateImage": {
        filter: "brightness(70%)",
      },
    },
  },
}));

function SelectionCard(props) {
  const classes = useStyles(props); // Ensure that props are passed to useStyles
  const { data, index, callBack, locationData } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleBoostGarage = async (id) => {
    try {
      setIsLoading(true);
      const response = await apiRouterCall({
        endPoint: "redeemGarage",
        paramsData: {
          _id: id,
          eventId: locationData?.raceData?.eventId,
        },
      });
      if (response?.data?.responseCode === 200) {
        toast.success(response?.data?.responseMessage);
        if (callBack) {
          callBack();
        }
      } else {
        toast.error(response?.data?.responseMessage);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Box className={classes.root} key={index}>
      <Box className="hoverbox">
        <Box className={classes.carMainBox}>
          <Box className="quantityNum">
            <Typography variant="h5">{data?.quantity}</Typography>
          </Box>
          <Box className="InfoGarageNum">
            <InfoModal data={garageData(data)} />
          </Box>
          <Box>
            <Box className="centerCircle"></Box>
            <img src={data?.garageId?.image || data?.image} alt="" />

            <Box className="selectButton">
              <Button
                variant="contained"
                color="secondary"
                style={{
                  background: "#000000AB",
                  color: "#fff",
                  border: "1px solid #394148",
                }}
                disabled={isLoading}
                onClick={() => handleBoostGarage(data?._id)}
              >
                {isLoading ? "Loading..." : "Boost"}
              </Button>
            </Box>

            <Typography
              variant="h6"
              style={{
                fontSize: "16px",
                position: "absolute",
                left: "10px",
                bottom: "10px",
              }}
              className="garageNameText"
            >
              {data?.garageId?.name}
            </Typography>

            <Typography variant="body1" className="newnameDetailssub">
              +{showAssetValue(data?.garageId)}{" "}
              {data?.garageId?.assetArray &&
                capitalizeFirstLetter(
                  toSpaceSeparated(data?.garageId?.assetArray)
                )}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SelectionCard;
