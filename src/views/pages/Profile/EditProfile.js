import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { BsEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import Select from "@material-ui/core/Select";
import { Form, Formik } from "formik";
import * as yup from "yup";
import MenuItem from "@material-ui/core/MenuItem";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { AuthContext } from "src/context/Auth";
//   import ApiConfig from "src/config/ApiConfig";
import moment from "moment";
// import { useHistory } from "react-router-dom";
//   import ButtonCircularProgress from "src/component/ButtonCircularProgress";
const useStyles = makeStyles((theme) => ({
  mainLoginContainer: {
    background: "rgba(255, 255, 255, 0.025)",
    padding: "20px",
    borderRadius: "10px",
    [theme.breakpoints.down("sm")]: {
      padding: "10px",
    },

    "& h1": {
      fontSize: "32px",
    },
    "& h6": {
      fontWeight: "300",
      fontSize: "16px",
      margin: "10px 0px",
      color: "rgba(255, 255, 255, 0.6)",
      width: "100%",
      maxWidth: "583px",
    },
  },
  formBox: {
    paddingTop: "30px",
    "& svg": {
      fontSize: "16px",
      color: "#555352",
    },
    "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "#BB2C2C !important",
    },
    "& .MuiFormHelperText-root.Mui-error": {
      color: "#BB2C2C !important",
      padding: "0px",
    },
    "& p": {
      color: "#fff !important",
      paddingBottom: "8px",
    },
    "& .MuiSelect-icon": {
      color: "#ffffff !important",
    },
    "& .MuiSvgIcon-root": {
      color: "#fff !important",
    },
  },

  outlineborder1: {
    "& .react-tel-input .form-control": {
      width: "100%",
      color: "#6D6D6D",
      borderRadius: "5px",
      height: "55px",
      background: "#131313",
      border: "1px solid #ffffff00",
    },
    "& .react-tel-input .country-list .country": {
      padding: "7px 9px",
      textAlign: "left",
      backgroundColor: "#2D2D2D",
      color: "#fff",
      "&:hover": {
        background: "#000000e3",
      },
    },
    "& .react-tel-input .selected-flag:hover, .react-tel-input .selected-flag:focus":
      {
        backgroundColor: "transparent !important",
      },
    "& .react-tel-input .selected-flag": {
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "none",
      },
    },
    "& .react-tel-input .selected-flag .arrow": {
      left: "20px",
    },

    "& .react-tel-input .country-list .country.highlight": {
      backgroundColor: "#000000e3",
    },
    "& .react-tel-input .flag-dropdown ": {
      backgroundColor: "transparent",
      //   borderRight: "1px solid #949494",
      border: "none",
      height: "44px",
      position: "absolute",
      top: "5px",
    },
    "& .react-tel-input .flag-dropdown.open .selected-flag": {
      background: "#FFFFFF06",
    },
  },
}));
export default function Profile() {
  const classes = useStyles();
  const [showPasswordold, setShowPasswordold] = useState(false);
  const [showPasswordnew, setShowPasswordnew] = useState(false);
  const [showPasswordcnf, setShowPasswordcnf] = useState(false);
  // const [countryCode, setCountryCode] = useState("");
  const [states, setStates] = useState([]);
  const [showCities, setShowCities] = useState([]);
  const [showStates, setShowStates] = useState([]);
  const [cities, setCities] = useState([]);
  // const [city, setCity] = useState("");
  // const [heading, setHeading] = useState("My Profile");
  // const profileData = auth?.userData;
  const auth = useContext(AuthContext);

  const stateList = auth?.userData?.state;
  const cityList = auth?.userData?.city;
  // const [isLoading, setIsLoading] = useState(false);
  // const history = useHistory();
  const [countries, setCountries] = useState([]);

  const changeCountry = (e) => {
    const name = e.target.value;
    changeCountryList(name);
  };

  const changeStateList = (name) => {
    const selectted = states.filter((cont) => {
      return cont.name === name;
    });

    if (selectted?.length !== 0) {
      const contId = selectted[0]?.id;

      const allCity = cities.filter((city) => {
        return city.state_id === contId;
      });
      setShowCities(allCity);
    }
  };

  const changeState = (e) => {
    const name = e.target.value;
    changeStateList(name);
  };

  const changeCountryList = (name) => {
    const selectted = countries?.filter((cont) => {
      return cont.name === name;
    });

    const contId = selectted[0]?.id;
    const allState = states?.filter((state) => {
      return state.country_id === contId;
    });
    setShowStates(allState);
  };
  useEffect(() => {
    axios.get("/json/countries.json").then(function (response) {
      setCountries(response.data.countries);
      axios.get("/json/states.json").then(function (response) {
        setStates(response.data.states);
        axios.get("/json/cities.json").then(function (response) {
          setCities(response.data.cities);
        });
      });
    });
  }, []);

  const formValidationSchema = yup.object().shape({
    firstName: yup
      .string()
      .min(3, "Please enter atleast 3 characters.")
      .max(32, "You can enter only 32 characters.")
      .required("First name is required.")
      .matches(
        /^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$/g,
        "Please enter first name."
      ),

    lastName: yup
      .string()
      .min(3, "Please enter atleast 3 characters.")
      .max(32, "You can enter only 32 characters.")
      .required("Last name is required.")
      .matches(
        /^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$/g,
        "Please enter last name."
      ),
    email: yup
      .string()
      .email("You have entered an invalid email address.")
      .max(254, "You can enter only 254 characters.")
      .required("Email address is required")
      .matches("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"),
    phoneNo: yup
      .string()
      .required("Mobile number is required.")
      .matches(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
        "Must be a valid mobilie"
      )
      .max(13, "Should not exceeds 13 digits.")
      .min(9, "Must be only 9 digits."),

    country: yup.string().required("Country is required."),
    state: yup.string().required("State is required."),
    // volume: yup.string().required("Volume is required"),

    dob: yup
      .string()
      .required("Date of birth is required.")
      .test(
        "DOB",
        "You must be atleast 18 years old or above.",
        (date) => moment().diff(moment(date), "years") >= 18
      ),

    cities: yup.string().required("City is required."),
    address: yup.string().required("Address is required."),
    // countryCode: yup.string().required("ZipCode is required"),
  });

  // const [selectedDate, setSelectedDate] = React.useState(new Date());

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };
  useEffect(() => {
    if (stateList) {
      setShowStates([{ name: stateList }]);
    }
  }, [stateList]);

  useEffect(() => {
    if (cityList) {
      setShowCities([{ name: cityList }]);
    }
  }, [cityList]);

  const handleChangePassword = async (values) => {
    //   try {
    //     setIsLoading(true);
    //     const res = await axios({
    //       method: "POST",
    //       url: ApiConfig.changePassword,
    //
    //       data: {
    //         oldPassword: values.oldpassword,
    //         newPassword: values.Confirmpassword,
    //       },
    //     });
    //     if (res.data.status === 200) {
    //       toast.success(res.data.responseMessage);
    //       setIsLoading(false);
    //     } else {
    //       toast.warn(res.data.responseMessage);
    //       setIsLoading(false);
    //     }
    //   } catch (error) {
    //     setIsLoading(false);
    //   }
  };
  const initialFormValues = {
    oldpassword: "",
    newPassword: "",
    Confirmpassword: "",
  };
  const validationFormSchema = yup.object().shape({
    oldpassword: yup
      .string()
      .required("Please enter valid password.")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character."
      )
      .min(8, "Please enter atleast 8 characters.")
      .max(16, "You can enter only 16 characters."),
    newPassword: yup
      .string()
      .required("Please enter valid password.")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character."
      )
      .min(8, "Please enter atleast 8 characters.")
      .max(16, "You can enter only 16 characters."),

    Confirmpassword: yup
      .string()
      .required("Please confirm your password.")
      .oneOf([yup.ref("newPassword"), null], "Password must match."),
  });

  return (
    <Box className={classes.mainregister}>
      <Container>
        <Box my={2} className={classes.mainLoginContainer}>
          <Box>
            <Typography variant="h1">Edit Profile</Typography>
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                address: "",
                phoneNo: "",
                country: "",
                state: "",
                cities: "",
                dob: moment.unix().format("MM/DD/YYYY")
                  ? moment.unix().format("MM/DD/YYYY")
                  : "",
                // volume: profileData?.volumeAccount
                //   ? profileData?.volumeAccount
                //   : "",
                IBIName: "",
                IBIID: "",
              }}
              initialStatus={{
                success: false,
                successMsg: "",
              }}
              validationSchema={formValidationSchema}
              onSubmit={async ({
                firstName,
                lastName,
                email,
                address,
                phoneNo,
                country,
                state,
                cities,
                dob,
                // volume,
              }) => {
                // try {
                //   setIsLoading(true);
                //   const res = await axios({
                //     method: "POST",
                //     url: ApiConfig.editProfile,
                //     headers: {
                //       authorization: `Bearer ${window.sessionStorage.getItem(
                //         "token"
                //       )}`,
                //     },
                //     data: {
                //       address: address,
                //       city: cities,
                //       country: country,
                //       dob: moment(dob).format("DD-MM-YYYY"),
                //       email: email,
                //       firstName: firstName,
                //       lastName: lastName,
                //       phoneNo: phoneNo?.toString(),
                //       state: state,
                //       countryCode: "string",
                //       gender: "string",
                //       pnWithoutCountryCode: "string",
                //       imageUrl: "string",
                //       // volumeAccount: volume,
                //     },
                //   });
                //   if (res.data.status === 200) {
                //     toast.success(res.data.responseMessage);
                //     setIsLoading(false);
                //     history.push("/dashboard");
                //   } else {
                //     toast.error(res.data.responseMessage);
                //     setIsLoading(false);
                //   }
                // } catch (err) {
                //   console.log(err);
                //   toast.error(err.responseMessage);
                //   setIsLoading(false);
                // }
              }}
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
                <Form onSubmit={handleSubmit}>
                  <Box className={classes.formBox}>
                    <Grid container spacing={3}>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">First Name</Typography>
                          <TextField
                            placeholder="Enter your first name"
                            variant="outlined"
                            name="firstName"
                            fullWidth
                            value={values.firstName}
                            error={Boolean(
                              touched.firstName && errors.firstName
                            )}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          <FormHelperText error>
                            {touched.firstName && errors.firstName}
                          </FormHelperText>
                        </Box>
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">Last Name</Typography>
                          <TextField
                            placeholder="Enter your last name"
                            variant="outlined"
                            name="lastName"
                            fullWidth
                            value={values.lastName}
                            error={Boolean(touched.lastName && errors.lastName)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          <FormHelperText error>
                            {touched.lastName && errors.lastName}
                          </FormHelperText>
                        </Box>
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">Email</Typography>
                          <TextField
                            placeholder="Enter your email"
                            variant="outlined"
                            name="email"
                            fullWidth
                            value={values.email}
                            error={Boolean(touched.email && errors.email)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          <FormHelperText error>
                            {touched.email && errors.email}
                          </FormHelperText>
                        </Box>
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">Mobile Number</Typography>
                          <FormControl
                            fullWidth
                            variant="filled"
                            className={classes.outlineborder1}
                          >
                            <PhoneInput
                              country={"us"}
                              name="phoneNo"
                              value={values.phoneNo}
                              error={Boolean(touched.phoneNo && errors.phoneNo)}
                              onBlur={handleBlur}
                              onChange={(phone, e) => {
                                // setCountryCode(e.dialCode);
                                setFieldValue("phoneNo", phone);
                              }}
                            />
                            <FormHelperText
                              error
                              style={{ margin: "0px", fontSize: "12px" }}
                            >
                              {touched.phoneNo && errors.phoneNo}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">Country</Typography>
                          <FormControl fullWidth>
                            <Select
                              variant="outlined"
                              name="country"
                              error={Boolean(touched.country && errors.country)}
                              onBlur={handleBlur}
                              value={values?.country}
                              onChange={(e) => {
                                handleChange(e);
                                changeCountry(e);
                              }}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {countries.map((countries) => {
                                return (
                                  <MenuItem
                                    key={countries.name + countries.id}
                                    value={countries.name}
                                  >
                                    {countries.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <FormHelperText error>
                            {touched.country && errors.country}
                          </FormHelperText>
                        </Box>
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">State</Typography>
                          <FormControl fullWidth>
                            <Select
                              fullWidth
                              variant="outlined"
                              name="state"
                              value={values?.state}
                              error={Boolean(touched.state && errors.state)}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                changeState(e);
                                handleChange(e);
                              }}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {showStates.lenght !== 0 &&
                                showStates.map((state) => {
                                  return (
                                    <MenuItem
                                      key={state.name + state.id}
                                      value={state.name}
                                    >
                                      {state.name}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </FormControl>
                          <FormHelperText error>
                            {touched.state && errors.state}
                          </FormHelperText>
                        </Box>
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">City</Typography>
                          <FormControl fullWidth>
                            <Select
                              fullWidth
                              name="cities"
                              variant="outlined"
                              value={values?.cities}
                              error={Boolean(touched.cities && errors.cities)}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                setCities(e);
                                handleChange(e);
                              }}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {showCities.lenght !== 0 &&
                                showCities.map((cities) => {
                                  return (
                                    <MenuItem
                                      key={cities.name + cities.id}
                                      value={cities.name}
                                    >
                                      {cities.name}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </FormControl>
                          <FormHelperText error>
                            {touched.cities && errors.cities}
                          </FormHelperText>
                        </Box>
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">Address</Typography>
                          <TextField
                            placeholder="Enter your address"
                            variant="outlined"
                            name="address"
                            fullWidth
                            value={values.address}
                            error={Boolean(touched.address && errors.address)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          <FormHelperText error>
                            {touched.address && errors.address}
                          </FormHelperText>
                        </Box>
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">Date of Birth</Typography>
                          <FormControl fullWidth>
                            <KeyboardDatePicker
                              disableFuture
                              inputVariant="outlined"
                              format="DD/MM/YYYY"
                              fullWidth
                              id="date-picker-inline"
                              name="dob"
                              value={values.dob}
                              onChange={(date) => {
                                setFieldValue("dob", new Date(date));
                              }}
                              maxDate={moment().subtract(4745, "days")}
                              error={Boolean(touched.dob && errors.dob)}
                              helperText={touched.dob && errors.dob}
                              KeyboardButtonProps={{
                                "aria-label": "change date",
                              }}
                            />
                            <FormHelperText error>
                              {touched.selectedDate && errors.selectedDate}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      </Grid>
                      {/* <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">
                            Volume Allocation
                          </Typography>
                          <FormControl
                            variant="outlined"
                            fullWidth
                            className={classes.forminput}
                          >
                            <Select
                              name="volume"
                              value={values.volume}
                              error={Boolean(touched.volume && errors.volume)}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              
                              // onChange={(e) => volume(e.target.value)}
                            >
                              <MenuItem value="1 month">1 month</MenuItem>
                              <MenuItem value="3 month">3 month</MenuItem>
                              <MenuItem value="6 month">6 month</MenuItem>
                            </Select>
                            <FormHelperText error>
                              {touched.volume && errors.volume}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      </Grid> */}
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">IBI Name</Typography>
                          <TextField
                            placeholder="Enter your first name"
                            variant="outlined"
                            name="IBIName"
                            fullWidth
                            value={values.IBIName}
                            error={Boolean(touched.IBIName && errors.IBIName)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          <FormHelperText error>
                            {touched.IBIName && errors.IBIName}
                          </FormHelperText>
                        </Box>
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">IBI ID</Typography>
                          <TextField
                            placeholder="Enter your first name"
                            variant="outlined"
                            name="IBIID"
                            type="number"
                            fullWidth
                            onInput={(e) => {
                              e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 16);
                            }}
                            value={values.IBIID}
                            error={Boolean(touched.IBIID && errors.IBIID)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          <FormHelperText error>
                            {touched.IBIID && errors.IBIID}
                          </FormHelperText>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  {/* <Box mt={3}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      color="secondary"
                    >
                      Update Profile {isLoading && <ButtonCircularProgress />}
                    </Button>
                  </Box> */}
                </Form>
              )}
            </Formik>
            <Formik
              initialValues={initialFormValues}
              validationSchema={validationFormSchema}
              onSubmit={(values, { resetForm }) => {
                handleChangePassword(values);
                resetForm("");
              }}
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
                  <Box mt={3} className={classes.formBox}>
                    <Typography variant="h4">Security</Typography>
                    <Typography variant="h6" style={{ margin: "4px 0px 16px" }}>
                      Change Your Password
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">Old password</Typography>
                          <TextField
                            type={showPasswordold ? "text" : "password"}
                            name="oldpassword"
                            placeholder="Enter you password"
                            variant="outlined"
                            fullWidth
                            value={values.oldpassword}
                            onChange={handleChange}
                            error={Boolean(
                              touched.oldpassword && errors.oldpassword
                            )}
                            InputProps={{
                              endAdornment: (
                                <IconButton
                                  onClick={() =>
                                    setShowPasswordold(!showPasswordold)
                                  }
                                >
                                  {showPasswordold ? (
                                    <BsEyeFill />
                                  ) : (
                                    <BsFillEyeSlashFill />
                                  )}
                                </IconButton>
                              ),
                            }}
                          />
                          <FormHelperText error>
                            {touched.oldpassword && errors.oldpassword}
                          </FormHelperText>
                        </Box>
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">New password</Typography>
                          <TextField
                            type={showPasswordnew ? "text" : "password"}
                            name="newPassword"
                            placeholder="Enter you password"
                            variant="outlined"
                            fullWidth
                            value={values.newPassword}
                            onChange={handleChange}
                            error={Boolean(
                              touched.newPassword && errors.newPassword
                            )}
                            onBlur={handleBlur}
                            InputProps={{
                              endAdornment: (
                                <IconButton
                                  onClick={() =>
                                    setShowPasswordnew(!showPasswordnew)
                                  }
                                >
                                  {showPasswordnew ? (
                                    <BsEyeFill />
                                  ) : (
                                    <BsFillEyeSlashFill />
                                  )}
                                </IconButton>
                              ),
                            }}
                          />
                          <FormHelperText error>
                            {touched.newPassword && errors.newPassword}
                          </FormHelperText>
                        </Box>
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box>
                          <Typography variant="body1">
                            Confirm new password
                          </Typography>
                          <TextField
                            type={showPasswordcnf ? "text" : "password"}
                            placeholder="Enter confirm password"
                            name="Confirmpassword"
                            variant="outlined"
                            fullWidth
                            value={values.Confirmpassword}
                            error={Boolean(
                              touched.Confirmpassword && errors.Confirmpassword
                            )}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            InputProps={{
                              endAdornment: (
                                <IconButton
                                  onClick={() =>
                                    setShowPasswordcnf(!showPasswordcnf)
                                  }
                                >
                                  {showPasswordcnf ? (
                                    <BsEyeFill />
                                  ) : (
                                    <BsFillEyeSlashFill />
                                  )}
                                </IconButton>
                              ),
                            }}
                          />
                          <FormHelperText error>
                            {touched.Confirmpassword && errors.Confirmpassword}
                          </FormHelperText>
                        </Box>
                      </Grid>
                    </Grid>
                    <Box mt={3} align="center">
                      <Button type="submit" variant="contained" color="primary">
                        Update
                      </Button>
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
