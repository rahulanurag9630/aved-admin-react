import React, { useContext, useEffect, useState } from "react";
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
  Checkbox,
  FormHelperText,
  IconButton,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { BsEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import { apiRouterCall } from "src/ApiConfig/service";
import toast from "react-hot-toast";
import { AuthContext } from "src/context/Auth";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
// import { encrypt } from "src/utils";
// import { sections } from "src/layouts/DashboardLayout/NavBar";

const useStyles = makeStyles((theme) => ({
  bannerBox: {
    maxWidth: "95%",
    width: "420px",
  },
  welcomeBox: {
    background: "rgb(255 255 255 / 3%)",
    borderRadius: "15px",
    "& p": {
      color: "rgba(255, 255, 255, 0.6)",
      fontWeight: 300,
    },
    "& h2": {
      fontFamily: "'Sora', sans-serif",
      "& span": {
        fontWeight: "200",
      },
    },
  },
  paperCustom: {
    backgroundColor: "rgba(255, 255, 255, 0.95) !important",
    backdropFilter: "blur(20px) !important",
    borderRadius: "20px !important",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1) !important",
    border: "1px solid rgba(255, 255, 255, 0.2) !important",
    paddingTop: "2.5rem !important",
    paddingBottom: "2.5rem !important",
    paddingLeft: "2.5rem !important",
    paddingRight: "2.5rem !important",
    maxWidth: "450px !important",
    width: "100% !important",
    margin: "0 auto !important",
    display: "flex !important",
    flexDirection: "column !important",
    alignItems: "center !important",
    justifyContent: "flex-start !important",
    minHeight: "480px !important",
    "@media(max-width: 768px)": {
      paddingTop: "2rem !important",
      paddingBottom: "2rem !important",
      paddingLeft: "2rem !important",
      paddingRight: "2rem !important",
      margin: "1rem !important",
      maxWidth: "calc(100% - 2rem) !important",
      minHeight: "420px !important",
    },
    "@media(max-width: 480px)": {
      paddingTop: "1.5rem !important",
      paddingBottom: "1.5rem !important",
      paddingLeft: "1.5rem !important",
      paddingRight: "1.5rem !important",
      margin: "0.5rem !important",
      maxWidth: "calc(100% - 1rem) !important",
      minHeight: "380px !important",
    },
  },

}));

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  let RememberMeString = window.localStorage.getItem("RememberMeString");
  let RememberMe = JSON.parse(RememberMeString);
  const [showPassword, setShowPassword] = useState(false);
  const [check, setCheck] = useState(false);
  const [ip, setIP] = useState("");
  const [location, setLocation] = useState("");
  const [browserInfo, setBrowserInfo] = useState("");

  const initialFormValues = {
    email: RememberMe?.email ? RememberMe.email : "",
    password: RememberMe?.password ? RememberMe.password : "",
  };

  const validationFormSchema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .email("Please enter a valid email.")
      .required("Email is required.")
      .max(100, "Should not exceeds 100 characters."),
    password: yup
      .string()
      .required("Password is required.")
      .min(8, "Password must be minimum of 8 characters.")
      .max(16, "Password should not exceeds 16 characters."),
  });

  const loginSubmit = async (values) => {
    try {
      setIsLoading(true);


      const res = await apiRouterCall({ method: "POST", endPoint: "login", bodyData: { emailUsernameOrPhone: values.email, password: values.password, ip } });
      console.log(res)


      if (res?.data?.responseCode === 200) {

        auth.userLogIn(true, res?.data?.result?.token);
        localStorage.setItem("id", res?.data?.result?._id);
        console.log("fmdmfg,mgfgfgfgf", res?.data?.result?._id)
        auth.setUserData(res?.data?.result || {})
        console.log(auth)
        history.push(
          `/dashboard`
        );
      } else {
        toast.error("Invalid dummy email for bypass.");
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("Login bypass error", err);
    }
  };


  const getBrowserName = () =>
    /Chrome/.test(navigator.userAgent)
      ? "Chrome"
      : /Firefox/.test(navigator.userAgent)
        ? "Firefox"
        : /Safari/.test(navigator.userAgent) &&
          !/Chrome/.test(navigator.userAgent)
          ? "Safari"
          : /Edge/.test(navigator.userAgent)
            ? "Edge"
            : "Other";

  useEffect(() => {
    setBrowserInfo(getBrowserName());
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        setIP(data.ip);
        fetch(`https://ipapi.co/${data.ip}/json/`) // Fetch location data
          .then((res) => res.json())
          .then((loc) => {
            const formattedLocation = `${loc.country_name || "Unknown"}, ${loc.city || loc.region || "Unknown"
              }`;
            setLocation(formattedLocation);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (RememberMe) {
      setCheck(true);
    }
  }, [RememberMe]);
  return (


    <Paper elevation={0} className={`${classes.paperCustom} glass-effect login-transition`}>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "2rem",
          // paddingBottom: "2rem",
          marginBottom: "1.5rem",
          width: "100%"
        }}
      >
        <Typography
          variant="h2"
          className="gradient-text"
          style={{
            fontWeight: 700,
            fontSize: "2.5rem",
            marginBottom: "1rem",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.02em"
          }}
        >
          Welcome Back
        </Typography>
        <Typography
          variant="body1"
          style={{
            color: "#7f8c8d",
            textAlign: "center",
            fontSize: "1rem",
            fontWeight: 400,
            lineHeight: 1.5,
            marginBottom: "0.5rem",
            maxWidth: "280px"
          }}
        >
          Sign in to your account
        </Typography>
      </Box>
      <Formik
        initialValues={initialFormValues}
        validationSchema={validationFormSchema}
        onSubmit={loginSubmit}
      >
        {({ errors, handleBlur, handleChange, touched, values }) => (
          <Form autoComplete="off" style={{ width: "100%", paddingTop: "1rem" }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box mb={1}>
                  <Typography variant="body2" style={{ color: "#2c3e50", fontWeight: 600 }}>
                    Email <span style={{ color: "#e74c3c" }}>*</span>
                  </Typography>
                </Box>
                <FormControl fullWidth className="formControl">
                  <TextField
                    variant="outlined"
                    placeholder="Please enter email"
                    fullWidth
                    name="email"
                    type="email"
                    value={values.email}
                    error={Boolean(touched.email && errors.email)}
                    onChange={handleChange}
                    autoComplete="new-email"
                    InputProps={{
                      autoComplete: "off",
                      style: {
                        borderRadius: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                      }
                    }}
                    disabled={isLoading}
                  />
                  <FormHelperText error>
                    {touched.email && errors.email}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box mt={1} mb={1}>
                  <Typography variant="body2" style={{ color: "#2c3e50", fontWeight: 600 }}>
                    Password <span style={{ color: "#e74c3c" }}>*</span>
                  </Typography>
                </Box>

                <FormControl fullWidth className="formControl">
                  <TextField
                    type={showPassword ? "text" : "password"}
                    name="password"
                    variant="outlined"
                    placeholder="Please enter password"
                    fullWidth
                    value={values.password}
                    error={Boolean(touched.password && errors.password)}
                    // onBlur={handleBlur}
                    onChange={handleChange}
                    autoComplete="new-password"
                    InputProps={{
                      autoComplete: "off",
                      style: {
                        borderRadius: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                      },
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ color: "#667eea" }}
                        >
                          {showPassword ? (
                            <BsEyeFill />
                          ) : (
                            <BsFillEyeSlashFill />
                          )}
                        </IconButton>
                      ),
                    }}
                    disabled={isLoading}
                  />
                  <FormHelperText error>
                    {touched.password && errors.password}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Box className="displaySpacebetween" mt={2}>
              <Box
                className="displayCenter"
                onClick={() => !isLoading && setCheck(!check)}
              >
                <Box>
                  <Checkbox checked={check} style={{ color: "#FFFFF " }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="primary"
                    style={{ cursor: "pointer" }}
                  >
                    Remember me
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  style={{ cursor: "pointer" }}
                  onClick={() => !isLoading && history.push("/forget")}
                >
                  <span style={{ color: "#fff" }}>
                    Forgot Password?
                  </span>
                </Typography>
              </Box>
            </Box>
            <Box mt={2} mb={2} align="center">
              <Button
                color="primary"
                variant="contained"
                type="submit"
                fullWidth
                disabled={isLoading}
              >
                Login {isLoading && <ButtonCircularProgress />}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>


  );
}
