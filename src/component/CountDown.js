import React, { useEffect, useState } from "react";
import { Box, Typography, makeStyles, Button, Paper } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import {
  calculateTimeLeft,
  numberCompactFormat,
  findEventStatus,
} from "src/utils";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  boxTypo5: {
    fontFamily: "Sora",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "0px",
    // mixBlendMode: "difference",
  },
}));
function CountDown({ start, end, timeLeft }) {
  const classes = useStyles();

  return (
    <Box style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <Box>
        <img
          src="images/timer.svg"
          alt="timer"
          style={{
            width: "100%",
          }}
        />
      </Box>{" "}
      {timeLeft !== undefined && timeLeft.minutes !== undefined ? (
        <Typography
          variant="body2"
          style={{ color: "#fff", fontWeight: "600", fontSize: "12px" }}
        >
          {timeLeft.days < 1 ? (
            <>
              {`${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}{" "}
              <span style={{ color: "#B1AFAF" }}>left</span>
            </>
          ) : (
            <>{moment(start).format("lll")} </>
          )}{" "}
        </Typography>
      ) : (
        <>0h 0m 0s</>
      )}
    </Box>
  );
}
export default React.memo(CountDown);
