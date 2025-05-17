import {
  Box,
  Button,
  makeStyles,
  FormControl,
  Typography,
  Paper,
  FormHelperText,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Timer from "src/component/Timer";
import { apiRouterCall } from "src/ApiConfig/service";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import { decrypt } from "src/utils";
import { AuthContext } from "src/context/Auth";
import OtpInput from "react-otp-input";

const useStyles = makeStyles((theme) => ({
  chamgepassBox: {
    height: "100%",
    position: "relative",
    zIndex: "999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "auto",
    // "& .inputWidthBox": {
    //   maxWidth: "245px",
    // },
  },
  forgetBox: {
    height: "initail",
    margin: "0px auto 15px",
    maxWidth: "550px",
    width: "100%",
    maxHeight: "100%",
    "& .mainBox": {
      // padding: "30px 40px 30px",
      [theme.breakpoints.down("xs")]: {
        padding: "20px 10px 50px",
      },
    },
    "& .buttonBox": {
      padding: "70px 0px 0px",
    },
    "& .textbox": {
      padding: "0px 0px 5px",
    },
  },
  otpFormControl: {
    "& input": {
      backgroundColor: "rgb(234 236 240) !important",
      width: "49px !important",
      height: "49px !important",
      marginRight: "10px !important",
      border: "0px",
      // boxShadow: "0px 0px 53px rgba(0, 0, 0, 0.25)",
      borderRadius: "10px",

      [theme.breakpoints.down("sm")]: {
        width: "40px !important",
        height: "40px !important",
        marginRight: "5px !important",
      },
    },
  },
}));

export default function Verifyotp() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const auth = useContext(AuthContext);
  const [isSubmit, setisSubmit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [OTP, setOTP] = useState("");
  const locationData = location.search.split("?")[1];
  const decriptData = locationData && decrypt(locationData);

  const handleFormSubmit = async () => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: "POST",
        endPoint: "verifyOTP",
        bodyData: {
          email: decriptData?.email,
          otp: OTP,
        },
      });
      if (response?.data?.responseCode === 200) {
        toast.success(response?.data?.responseMessage);
        if (decriptData?.type === "login") {
          auth.userLogIn(true, response?.data?.result?.token);
          history.replace(decriptData?.nextRoute);
        } else {
          history.replace({
            pathname: "/reset",
            search: response?.data?.result?.token,
          });
        }
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };

  return (
    <Box className={classes.chamgepassBox}>
      <Box className={classes.forgetBox}>
        <Paper className="mainBox" elevation={2}>
          <Box className="displayStart" mb={1}>
            <Typography variant="h2" color="primary">
              Verification OTP
            </Typography>
          </Box>
          <Box className="textbox" align="left">
            <Typography variant="body2" color="secondary">
              A 6 - digit OTP has been sent to your registered email.
            </Typography>

            <Box align="center" className="displayCenter" mt={3}>
              <Box>
                <FormControl fullWidth className={classes.otpFormControl}>
                  <OtpInput
                    value={OTP}
                    inputVariant="standard"
                    inputType="number"
                    onChange={setOTP}
                    numInputs={6}
                    autoFocus={true}
                    disabled={isUpdating}
                    renderInput={(props) => (
                      <input {...props} onPaste={(e) => e.preventDefault()} />
                    )}
                    secure
                  />

                  <Box
                    style={{ width: "100%" }}
                    className="displaySpacebetween"
                    mt={0.5}
                  >
                    <FormHelperText error style={{ color: "red" }}>
                      {isSubmit && OTP == "" && "Please enter otp."}
                      {isSubmit &&
                        OTP !== "" &&
                        OTP.length != "6" &&
                        "Please enter valid otp."}
                    </FormHelperText>
                    <Timer emailData={decriptData?.email} />
                  </Box>
                </FormControl>
              </Box>
            </Box>
          </Box>

          <Box align="center" mt={2}>
            {/* <Button
              color="secondary"
              variant="contained"
              disabled={isUpdating}
              style={{
                marginRight: "8px",
              }}
              onClick={() => history.goBack()}
            >
              Back
            </Button> */}
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={() => {
                setisSubmit(true);
                if (OTP.length == 6) {
                  setisSubmit(false);
                  handleFormSubmit();
                }
              }}
              disabled={isUpdating}
            >
              Submit {isUpdating && <ButtonCircularProgress />}
            </Button>
          </Box>

          <Box textAlign={"center"} mt={2}>
            <Typography variant="body2" color="secondary">
              Forget it. Send me{" "}
              <span
                style={{ color: "rgb(122 90 248)", cursor: "pointer" }}
                onClick={() => history.goBack()}
                // disabled={isLoading}
              >
                Back
              </span>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
