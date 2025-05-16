import React, { useEffect, useState } from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import {
  calculateTimeLeft,
  numberCompactFormat,
  findEventStatus,
} from "src/utils";
import moment from "moment";
import CountDown from "./CountDown";

const useStyles = makeStyles((theme) => ({
  upcomingRaceBox: {
    transition: "0.5s",
    position: "relative",
    cursor: "pointer",
    borderRadius: "5px",
  },
  neonBorder: {
    background:
      "linear-gradient(93.14deg,rgba(255,176,0,0) -20.75%,rgba(230,229,232,.631372549) 11.84%,rgba(0,0,0,.7) 53.76%,hsla(0,0%,100%,.368627451) 102.96%)",
    padding: "1px",
    borderRadius: "5px",
  },
  mainImg: {
    padding: "10px",
    height: "144px !important",
    display: "flex",
    position: "relative",
    alignItems: "start",
    flexDirection: "column",
    backgroundSize: "cover !important",
    justifyContent: "start",
    backgroundColor: "#000 !important",
    backgroundRepeat: "no-repeat !important",
    backgroundPosition: "center !important",
    border: "1.5px solid #394148",
    borderRadius: "5px",
    width: "inherit",
    "&::after": {
      top: "0",
      left: "0",
      content: '""',
      width: "100%",
      height: "100%",
      zIndex: "1",
      position: "absolute",
      background: "linear-gradient(180deg, hsla(0, 0%, 40%, 0), #000 95.99%)",
      borderRadius: "5px",
      backgroundColor: "rgba(0, 0, 0, .231372549)",
    },
  },
  timerTitle: {
    fontFamily: "Good Times W00 Bold",
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: "30px",
    // textAlign: "center",
    color: "#FFFFFF",
    textTransform: "uppercase",
    zIndex: 3,
    position: "relative",
  },
  timerTitle1: {
    zIndex: "3",
    position: "relative",
    fontSize: "12px",
    fontFamily: '"Sora", sans-serif',
    fontWeight: "700",
    lineHeight: "30px",
  },
  title: {
    fontFamily: "Sora, sans-serif",
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: "20px",
    textAlign: "left",
    color: "rgba(255, 98, 59, 1)",
    textTransform: "uppercase",
    zIndex: 3,
    position: "relative",
    marginTop: "-10px",
  },

  boxTypo4: {
    zIndex: "3",
    position: "relative",
    fontSize: "26px",
    fontFamily: "Roboto Condensed",
    fontWeight: "700",
    marginLeft: "4px",
  },

  buttonBox: {
    display: "flex",
    alignItems: "end",
  },
}));

const UpcomingRaceCard = ({ data, index }) => {
  const classes = useStyles();
  const history = useHistory();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [eventCheck, setEventCheck] = useState(findEventStatus());

  const updateDimensions = () => {
    var offsetWidth = document.getElementById("imagecard" + index).offsetWidth;
    var newoofsetWidth = offsetWidth - 150;
    document.getElementById("imagecard" + index).style.height =
      newoofsetWidth + "px";
  };

  useEffect(() => {
    if (data?.startDate && data?.endDate) {
      setEventCheck(findEventStatus(data?.startDate, data?.endDate));
    }
  }, [data]);

  useEffect(() => {
    let timer;
    if (data?.startDate) {
      timer = setInterval(() => {
        setTimeLeft(
          calculateTimeLeft(parseInt(moment(data?.startDate).unix()) * 1000)
        );
      }, 1000);
    }
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    updateDimensions();
  }, [data, index]);
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <Box
      className={classes.upcomingRaceBox}
      onClick={() => {
        const stateData = {
          gameStatus: "liveupcoming",
          vehicleType: data?.vehicleType,
        };
        localStorage.setItem("stateData", JSON.stringify(stateData));
        history.push("/practice-race");
      }}
    >
      <Box className={classes.neonBorder}>
        {" "}
        <Box
          id={`imagecard${index}`}
          className={classes.mainImg}
          style={{
            background: "url(" + data.image + ")",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            width="100%"
            style={{ marginTop: "-6px" }}
          >
            <Box>
              <div className="tooltip">
                <Typography
                  className={classes.timerTitle + " truncate-text1"}
                  variant="body1"
                >
                  {data?.name && data?.name}
                </Typography>
                {data?.name?.length > 14 && (
                  <span className="tooltiptext1">
                    {data?.name && data?.name}
                  </span>
                )}
              </div>
              <Typography className={classes.title} variant="h3">
                TOURNAMENT
              </Typography>
            </Box>
            <Typography className={classes.timerTitle1} variant="h2">
              {eventCheck &&
              timeLeft !== undefined &&
              timeLeft.minutes !== undefined &&
              timeLeft.days < 1 ? (
                <span
                  className="displayEnd"
                  style={{
                    animation: "flash 4.5s 1s infinite",
                  }}
                >
                  {" "}
                  <div class="dot"></div> Live{" "}
                </span>
              ) : (
                eventCheck
              )}
            </Typography>
          </Box>
          <Box
            className="displaySpacebetween"
            style={{
              width: "100%",
              bottom: "13px",
              position: "absolute",
            }}
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "7px",
              }}
            >
              <Box style={{ display: "flex", alignItems: "center" }}>
                <Box
                  style={{
                    width: "20px",
                    height: "20px",
                    zIndex: 3,
                    position: "relative",
                  }}
                >
                  <img
                    src="images/logo1.png"
                    alt="logo1"
                    style={{ width: "100%", height: "100%" }}
                  />
                </Box>
                <Typography className={classes.boxTypo4}>
                  {" "}
                  {numberCompactFormat(data?.price)}
                </Typography>
              </Box>
              {eventCheck && (
                <Box style={{ position: "relative", zIndex: "3" }}>
                  <CountDown
                    start={data.start}
                    end={data.end}
                    timeLeft={timeLeft}
                  />
                </Box>
              )}
            </Box>
            <Box className={classes.buttonBox}></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpcomingRaceCard;
