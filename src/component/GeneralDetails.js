import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ButtonCircularProgress from "./ButtonCircularProgress";
import { apiRouterCall } from "src/ApiConfig/service";
import toast from "react-hot-toast";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { MdVerified } from "react-icons/md";

const GeneralDetails = ({ userData }) => {
  let delayTimer;
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showVerificationIcon, setShowVerificationIcon] = useState(false);

  const initialFormValues = {
    email: userData?.email || "",
  };

  const validationFormSchema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .email("Please enter a valid email.")
      .required("Email is required.")
      .max(100, "Should not exceeds 100 characters."),
  });

  const loginSubmit = async (values) => {
    if (apiError !== "") return;
    try {
      setIsLoading(true);
      const response = await apiRouterCall({
        method: "PUT",
        endPoint: "editUser",
        bodyData: {
          userId: userData._id,
          email: values.email.toLowerCase(),
        },
      });

      if (response?.data?.responseCode === 200) {
        toast.success(response?.data?.responseMessage);
        history.push("/usermanagement");
      } else {
        toast.error(response?.data?.responseMessage);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(" err ", err);
    }
  };

  const fetchDataFromAPI = async (email) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "checkEmail",
        paramsData: {
          email: email,
        },
      });
      if (response?.data?.responseCode === 200) {
        return response;
      } else {
        return { error: response.data.responseMessage };
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Paper elevation={2} mt={2} style={{ marginTop: "16px" }}>
        <Typography color="primary" variant="h5">
          Basic Information
        </Typography>
        <Box mt={3}>
          <Formik
            initialValues={initialFormValues}
            validationSchema={validationFormSchema}
            onSubmit={loginSubmit}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              touched,
              values,
              setFieldError,
            }) => (
              <Form autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Box style={{
                      border: "2px dashed #FFFFFF26",
                      width: "220px",
                      display: "flex",
                      height: "215px",
                      padding: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#746058",
                      borderRadius: "10px",

                    }}>
                      <figure className="figure">
                        <Avatar
                          style={{
                            height: "120px",
                            width: "120px",
                            borderRadius: "100px",
                            marginTop: "40px",
                          }}
                          src={
                            "images/profile.png"
                          }
                        />
                      </figure>
                    </Box>


                  </Grid>
                  <Grid item xs={12} sm={8} md={6}>
                    <Box mb={1}>
                      <Typography color="secondary" variant="subtitle1">
                        First Name :
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="First name"
                      disabled
                      value={userData?.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8} md={6}>
                    <Box mb={1}>
                      <Typography color="secondary" variant="subtitle1">
                        Last Name :
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Last name"
                      disabled
                      value={userData?.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8} md={6}>
                    <Box mb={1}>
                      <Typography color="secondary" variant="subtitle1">
                        Email Address :
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Email address"
                      value={values?.email}
                      name="email"
                      type="email"
                      error={Boolean(touched.email && errors.email)}
                      onBlur={handleBlur}
                      disabled={isLoading || !isEdit}
                      onChange={async (e) => {
                        handleChange(e);
                        clearTimeout(delayTimer);
                        const email = e.target.value;
                        delayTimer = setTimeout(async () => {
                          const userDataApi =
                            email !== "" && (await fetchDataFromAPI(email));
                          if (
                            userDataApi &&
                            userDataApi.error &&
                            email !== userData?.email
                          ) {
                            setFieldError("email", userDataApi.error);
                            setApiError(userDataApi.error);
                            setShowVerificationIcon(false);
                          } else if (userDataApi) {
                            setApiError("");
                            handleChange({
                              target: {
                                name: "email",
                                value: email,
                              },
                            });
                            setShowVerificationIcon(true);
                          }
                        }, 1000);
                      }}
                      InputProps={
                        showVerificationIcon && !errors.email && touched.email
                          ? {
                            endAdornment: (
                              <InputAdornment position="end">
                                <MdVerified
                                  style={{
                                    fontSize: "19px",
                                    color: "green",
                                  }}
                                />
                              </InputAdornment>
                            ),
                          }
                          : {}
                      }
                    />
                    <FormHelperText error>
                      {(touched.email && errors.email) || apiError}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} sm={8} md={6}>
                    <Box mb={1}>
                      <Typography color="secondary" variant="subtitle1">
                        Date of Birth :
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Date of Birth"
                      disabled
                      value={userData?.telegramId}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8} md={6}>
                    <Box mb={1}>
                      <Typography color="secondary" variant="subtitle1">
                        Gender :
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Gender"
                      disabled
                      value={userData?.designation}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8} md={6}>
                    <Box mb={1}>
                      <Typography color="secondary" variant="subtitle1">
                        Sexual orientation :
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Your Sexual orientation"
                      disabled
                      value={userData?.walletStatus}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8} md={6}>
                    <Box mb={1}>
                      <Typography color="secondary" variant="subtitle1">
                        Height :
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Height"
                      disabled
                      value={userData?.walletAddress}
                    />
                  </Grid>
                </Grid>
                {/* <Box mt={2} mb={2} align="left">
                  <Button
                    color={isEdit ? "secondary" : "primary"}
                    variant="contained"
                    disabled={isLoading}
                    style={{ padding: "12px 30px" }}
                    onClick={() => {
                      setApiError("");
                      setIsEdit(!isEdit);
                    }}
                  >
                    {isEdit ? "Cancel" : "Edit"}
                  </Button>
                  &nbsp;&nbsp;
                  {isEdit && (
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      style={{ padding: "12px 30px" }}
                      disabled={isLoading}
                    >
                      Update {isLoading && <ButtonCircularProgress />}
                    </Button>
                  )}
                </Box> */}
              </Form>
            )}
          </Formik>
        </Box>
      </Paper >
      {/* <Paper elevation={2} mt={2} style={{ marginTop: "16px" }}>
        <Typography color="primary" variant="h5" mt={3}>
          PARENT INFORMATION
        </Typography>
        <Box mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8} md={6}>
              <Box mb={1}>
                <Typography color="secondary" variant="subtitle1">
                  Parent First Name:
                </Typography>
              </Box>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="First name"
                disabled
                value={userData?.referredBy?.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <Box mb={1}>
                <Typography color="secondary" variant="subtitle1">
                  Parent Last Name:
                </Typography>
              </Box>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Last name"
                disabled
                value={userData?.referredBy?.lastName}
              />
            </Grid>

            <Grid item xs={12} sm={8} md={6}>
              <Box mb={1}>
                <Typography color="secondary" variant="subtitle1">
                  Email :
                </Typography>
              </Box>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Email"
                disabled
                value={userData?.referredBy?.email}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <Box mb={1}>
                <Typography color="secondary" variant="subtitle1">
                  Wallet Status :
                </Typography>
              </Box>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Status"
                disabled
                value={
                  userData?.referredBy?.userType === "ADMIN"
                    ? "ACTIVE"
                    : userData?.referredBy?.walletStatus
                }
              />
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <Box mb={1}>
                <Typography color="secondary" variant="subtitle1">
                  Wallet Address :
                </Typography>
              </Box>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Wallet Address"
                disabled
                value={userData?.referredBy?.walletAddress}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper> */}
    </>
  );
};

export default GeneralDetails;
