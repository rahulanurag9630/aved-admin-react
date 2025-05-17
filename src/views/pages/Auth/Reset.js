import React, { useState } from "react";
import {
  Box,
  makeStyles,
  Typography,
  Paper,
  Button,
  Container,
  FormControl,
  Grid,
  TextField,
  IconButton,
  FormHelperText,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";
import { BsEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import toast from "react-hot-toast";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import { apiRouterCall } from "src/ApiConfig/service";

const useStyles = makeStyles((theme) => ({
  flexBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeBox: {
    "& .resent-text": {
      display: "flex",
      justifyContent: "flex-end",
      "& p": { cursor: "pointer" },
    },
    padding: "30px",
    [theme.breakpoints.down("xs")]: {
      padding: "20px 10px",
    },
    "& svg": {
      color: "#FFFFFF26",
    },
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

  otpFormControl: {
    "& input": {
      // color: theme.palette.primary.main,
      width: "49px !important",
      height: "49px !important",
      marginRight: "10px !important",
      // border: "0px",
      // background: theme.palette.background.card,
      // boxShadow: "0px 0px 53px rgba(0, 0, 0, 0.25)",
      borderRadius: "10px",
      color: "#fff",
      background: "#161616",
      border: "1px solid #1b1b1b",
      "@media(max-width:460px)": {
        width: "41px !important",
        height: "41px !important",
      },
      "@media(max-width:380px)": {
        width: "31px !important",
        height: "31px !important",
      },
    },
  },
}));

export default function Forgot() {
  const classes = useStyles();
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false); //resetPasswordAdmin
  const [isUpdating, setIsUpdating] = useState(false);
  const token = window.location.search.split("?")[1];

  const initialFormValues = {
    password: "",
    confirmPassword: "",
  };
  const validationFormSchema = yup.object().shape({
    password: yup
      .string()
      .trim()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character."
      )
      .required("Password is required.")
      .min(8, "Please enter atleast 8 characters.")
      .max(16, "You can enter only 16 characters."),
    confirmPassword: yup
      .string()
      .required("Confirmation of your password is required.")
      .oneOf([yup.ref("password"), null], "Password must match."),
  });

  const loginSubmit = async (values) => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: "PUT",
        endPoint: "resetPassword",
        token: token,
        bodyData: {
          password: values.password,
          confirmPassword: values.confirmPassword,
        },
      });
      if (response?.data?.responseCode === 200) {
        toast.success(response?.data?.responseMessage);
        history.push("/login");
      } else {
        toast.error(response?.data?.responseMessage);
      }
      setIsUpdating(false);
    } catch (err) {
      setIsUpdating(false);
      console.log(err);
    }
  };

  return (
    <Paper elevation={2}>
      <Box className="displayStart" mb={3}>
        <Typography variant="h2" color="primary">
          Reset Password
        </Typography>
      </Box>
      <Formik
        initialValues={initialFormValues}
        validationSchema={validationFormSchema}
        onSubmit={loginSubmit}
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
                <Box mt={1} mb={1}>
                  <Typography variant="body2" color="secondary">
                    New password <span style={{ color: "#FD3124" }}>*</span>
                  </Typography>
                </Box>

                <FormControl fullWidth className="formControl">
                  <TextField
                    type={showPassword ? "text" : "password"}
                    name="password"
                    variant="outlined"
                    placeholder="Please enter new password"
                    fullWidth
                    value={values.password}
                    error={Boolean(touched.password && errors.password)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled={isUpdating}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <BsEyeFill />
                          ) : (
                            <BsFillEyeSlashFill />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                  <FormHelperText error>
                    {touched.password && errors.password}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box mt={1} mb={1}>
                  <Typography variant="body2" color="secondary">
                    Confirm Password <span style={{ color: "#FD3124" }}>*</span>
                  </Typography>
                </Box>

                <FormControl fullWidth className="formControl">
                  <TextField
                    type={showPassword1 ? "text" : "password"}
                    name="confirmPassword"
                    variant="outlined"
                    placeholder="Please enter confirm password"
                    fullWidth
                    value={values.confirmPassword}
                    error={Boolean(
                      touched.confirmPassword && errors.confirmPassword
                    )}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled={isUpdating}
                    onPaste={(e) => e.preventDefault()}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword1(!showPassword1)}
                        >
                          {showPassword1 ? (
                            <BsEyeFill />
                          ) : (
                            <BsFillEyeSlashFill />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                  <FormHelperText error>
                    {touched.confirmPassword && errors.confirmPassword}
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
                disabled={isUpdating}
              >
                Submit {isUpdating && <ButtonCircularProgress />}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}
