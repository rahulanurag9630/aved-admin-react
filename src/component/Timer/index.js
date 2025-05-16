import React, { useState, useEffect, useMemo } from "react";
import { Typography, Box, Button } from "@material-ui/core";
import moment from "moment";
import { calculateTimeLeftForOtp } from "src/utils";
import { toast } from "react-hot-toast";
import ButtonCircularProgress from "../ButtonCircularProgress";
import { apiRouterCall } from "src/ApiConfig/service";

export default function Timer({ emailData }) {
  const [endTime, setEndTime] = useState(
    moment().add(3, "m").add(1, "s").unix()
  );
  const [timeStamp, setTimeStamp] = useState();
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  useEffect(() => {
    if (endTime) {
      const timer = setTimeout(() => {
        setTimeStamp(calculateTimeLeftForOtp(endTime * 1000));
        const timeLefts = calculateTimeLeftForOtp(endTime * 1000);
        window.localStorage.setItem("otpTimer", JSON.stringify(timeLefts));
      }, 1000);
      return () => clearTimeout(timer);
    }
  });

  const handleResendOtpSubmit = async () => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: "POST",
        endPoint: "resendOTP",
        bodyData: {
          email: emailData,
        },
      });
      if (response?.data?.responseCode == 200) {
        window.localStorage.removeItem("otpTimer");
        setEndTime(moment().add(3, "m").unix());
        toast.success(response?.data?.responseMessage);
      } else {
        toast.error(response?.data?.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
    }
  };

  const timeLeft = useMemo(() => {
    if (localStorage.getItem("otpTimer")) {
      const storedTimer = localStorage.getItem("otpTimer");
      const parsedTimer = JSON.parse(storedTimer);
      !timeStamp &&
        setEndTime(
          moment()
            .add(parsedTimer?.minutes, "m")
            .add(parsedTimer?.seconds, "s")
            .unix()
        );
      return parsedTimer;
    }
  }, [localStorage.getItem("otpTimer")]);

  return (
    <Box mr={1.6}>
      {loading ? (
        <Typography variant="body2" color="primary">
          Loading...
        </Typography>
      ) : (
        <>
          {timeLeft && timeLeft.seconds >= 0 ? (
            <Typography variant="body2" color="primary">
              {" "}
              {timeLeft?.minutes.toString().padStart(2, "0")}m :{" "}
              {timeLeft?.seconds.toString().padStart(2, "0")}s
            </Typography>
          ) : (
            <Button
              onClick={() => handleResendOtpSubmit()}
              disabled={isUpdating}
              style={{
                color: "#11D9EF",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: "700",
                padding: "0px",
              }}
            >
              Resend OTP {isUpdating && <ButtonCircularProgress />}
            </Button>
          )}
        </>
      )}
    </Box>
  );
}
