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
import { encrypt } from "src/utils";
import { sections } from "src/layouts/DashboardLayout/NavBar";

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
    backgroundColor: "#071c359c !important",
    backdropFilter: "blur(2px) !important",

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
        console.log("fmdmfg,mgfgfgfgf",res?.data?.result?._id)
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
  }, []);
  return (


    <Paper elevation={2} className={classes.paperCustom} sx={{
      zIndex: 1000,
      backdropFilter: "blur(2px) !important",
      backgroundColor: "rgba(255, 255, 255, 0.7)", // semi-transparent for blur to show
      WebkitBackdropFilter: "blur(10px)" // for Safari support

    }}>
      <Box className="displayCenter" mb={3}>
        <Typography variant="h2" color="primary">
          Login
        </Typography>
      </Box>
      <Formik
        initialValues={initialFormValues}
        validationSchema={validationFormSchema}
        onSubmit={loginSubmit}
      >
        {({ errors, handleBlur, handleChange, touched, values }) => (
          <Form autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box mb={1}>
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
                    type="email"
                    value={values.email}
                    error={Boolean(touched.email && errors.email)}
                    // onBlur={handleBlur}
                    onChange={handleChange}
                    autoComplete="new-email"
                    InputProps={{
                      autoComplete: "off",
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
                  <Typography variant="body2" color="primary">
                    Password <span style={{ color: "#FD3124" }}>*</span>
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
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <BsEyeFill style={{ color: "9e9d9d" }} />
                          ) : (
                            <BsFillEyeSlashFill style={{ color: "9e9d9d" }} />
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
