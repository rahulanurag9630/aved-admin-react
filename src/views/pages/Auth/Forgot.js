import React, { useState } from "react";
import {
  Box,
  makeStyles,
  Typography,
  Paper,
  Button,
  FormControl,
  Grid,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";
import { apiRouterCall } from "src/ApiConfig/service";
import toast from "react-hot-toast";
import { encrypt } from "src/utils";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";

const useStyles = makeStyles((theme) => ({
  flexBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  welcomeBox: {
    padding: "30px",

    "& p": {
      color: "rgba(255, 255, 255, 0.6)",
      marginTop: "8px",
      marginBottom: "8px",
      fontWeight: 300,
    },
    "& h2": {
      fontFamily: "'Sora', sans-serif",
      "& span": {
        fontWeight: "200",
      },
    },
  },
  mintedBox: {
    padding: "20px",
    "& h6": {
      fontWeight: "300",
      fontSize: "35px",
      lineHeight: "130%",
    },
    "& p": {
      color: "rgba(255, 255, 255, 0.6)",
      marginTop: "8px",
      marginBottom: "8px",
      fontWeight: 300,
    },
    "& .formControl": {
      marginTop: "8px",
      marginBottom: "8px",
    },
  },
  typoBox: {
    "& p": {
      color: "rgba(255, 255, 255, 0.6)",
      marginTop: "8px",
      marginBottom: "8px",
    },
  },
   paperCustom: {
  backgroundColor: "#071c359c !important",
},
}));

export default function Forgot() {
  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const initialFormValues = {
    email: "",
  };

  const validationFormSchema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .email("Please enter a valid email.")
      .required("Email is required.")
      .max(100, "Should not exceeds 100 characters."),
  });

  const forgotHandler = async (values) => {
    try {
      setIsLoading(true);
      const response = await apiRouterCall({
        method: "POST",
        endPoint: "forgotPassword",
        bodyData: {
          email: values.email.toLowerCase(),
        },
      });
      if (response?.data?.responseCode === 200) {
        toast.success(response?.data?.responseMessage);
        localStorage.removeItem("otpTimer");
        history.push(
          `/verify-otp?${encrypt({
            email: values.email.toLowerCase(),
            type: "forgot",
          })}`
        );
      } else {
        toast.error(response?.data?.responseMessage);
      }
      setIsLoading(false);
    } catch (err) {
      console.log(" err ", err);
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={2} className={classes.paperCustom}>
      <Box className="displayStart" mb={1}>
        <Typography variant="h2" color="primary">
          Forgot Password
        </Typography>
      </Box>
      <Box textAlign={"left"}>
        <Typography variant="body2" color="primary">
          Enter your registered email here, we will send a verification link to
          retrieve your password.
        </Typography>
      </Box>
      <Formik
        initialValues={initialFormValues}
        validationSchema={validationFormSchema}
        onSubmit={forgotHandler}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          touched,
          values,
          setFieldValue,
        }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box mt={3} mb={1}>
                  <Typography variant="body2" color="primary">
                    Email <span style={{ color: "#FD3124" }}>*</span>
                  </Typography>
                </Box>

                <FormControl fullWidth className="formControl">
                  <TextField
                    variant="outlined"
                    placeholder="Please enter email"
                    fullWidth
                    name="email"
                    value={values.email}
                    error={Boolean(touched.email && errors.email)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <FormHelperText error>
                    {touched.email && errors.email}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Box mt={2} mb={2} align="center">
              <Button
                color="primary"
                variant="contained"
                type="submit"
                fullWidth
                disabled={isLoading}
              >
                Submit {isLoading && <ButtonCircularProgress />}
              </Button>
            </Box>

            {/* <Button
              color="secondary"
              variant="contained"
              style={{
                marginRight: "8px",
              }}
              onClick={() => history.goBack()}
              disabled={isLoading}
            >
              Back
            </Button> */}

            <Box textAlign={"center"}>
              <Typography variant="body2" color="primary">
                Forget it. Send me back to{" "}
                <span
                  style={{ color: "rgb(0 217 255)", cursor: "pointer" }}
                  onClick={() => history.goBack()}
                  disabled={isLoading}
                >
                  Sign In
                </span>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}
