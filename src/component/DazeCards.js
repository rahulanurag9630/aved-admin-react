/* eslint-disable jsx-a11y/alt-text */
import { calculateTimeLeft, findEventStatus } from "src/utils";
import { Box, makeStyles, Typography } from "@material-ui/core";
import moment from "moment";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  dazeCardsBox: {
    position: "relative",
    zIndex: "1",
    "& .liveBox": {
      background: "#15875E",
      borderRadius: "8px",
      padding: "5px 15px",
    },
   
  },
  mainimg: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    padding:"30px 0px",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
}));

export default function DazeCards({ data, index, setSelectedEventId }) {
  const classes = useStyles();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [eventCheck, setEventCheck] = useState(findEventStatus());

  useEffect(() => {
    let timer;
    if (data?.startDate) {
      timer = setInterval(() => {
        setTimeLeft(
          calculateTimeLeft(parseInt(moment(data?.startDate).unix()) * 1000)
        );
      }, 1000);
      if (timeLeft === "live") {
        clearInterval(timer);
      }
    }
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (data?.startDate && data?.endDate) {
      setEventCheck(findEventStatus(data?.startDate, data?.endDate));
    }
  }, [data]);


  const updateDimensions = () => {
    var offsetWidth = document.getElementById("imagecard" + index).offsetWidth;
    var newoofsetWidth = offsetWidth - 110;
    document.getElementById("imagecard" + index).style.height =
      newoofsetWidth + "px";
  };

  useEffect(() => {
    updateDimensions();
  }, [data, index]);

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <Box className={classes.dazeCardsBox} mr={1} key={`${index}`}>
      <Box className="dazeBox" onClick={() => setSelectedEventId(data?._id)}>
        <Box style={{ position: "relative", zIndex: "999" }}>
          <Box className="centerCircle"></Box>
          <Box
            className="displaySpacebetween" 
            style={{ alignItems: "flex-start" }}
          >
            <Box>
              <Typography variant="h5">{data.name}</Typography>
              <Typography variant="body2">
                {" "}
                {data?.vehicleType &&
                  data?.vehicleType.charAt(0).toUpperCase() +
                    data?.vehicleType.slice(1).toLowerCase()}{" "}
                Specific Race
              </Typography>
              <Box mt={0.7}>
                <Typography variant="h6"></Typography>
              </Box>
            </Box>
            {eventCheck === "Live" && (
              <Box className="liveBox">
                {/* <Typography variant="body2">Live</Typography> */}{" "}
                <Typography variant="h4">Live</Typography>
              </Box>
            )}
          </Box>
          <Box
          id={`imagecard${index}`}
          className={classes.mainimg}
          style={{
            height: `${
              document.getElementById("imagecard" + index)?.style?.height
            }px`,
          }}
        >
          <img src={data.image} alt={`Main Image ${index}`} />
        </Box> 
          <Box className="displaySpacebetween">
            <Box className="displayStart">
              {eventCheck !== "Live" && (
                <>
                  <Box mr={1}>
                    <img
                      src="images/dazetime.png"
                      style={{ maxWidth: "100%" }}
                    />
                  </Box>
                  <Typography variant="body2" style={{ color: "#B1AFAF" }}>
                    {timeLeft !== undefined && timeLeft.minutes !== undefined
                      ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
                      : "0d 0h 0m 0s"}{" "}
                    left
                  </Typography>
                </>
              )}
            </Box>
            <Typography variant="body2" style={{ color: "#B1AFAF" }}>
              {data?.price || "0"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
