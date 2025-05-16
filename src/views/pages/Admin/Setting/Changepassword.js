import {
  Box,
  Grid,
  makeStyles,
  Typography,
  TextField,
  Button,
  Paper,
  FormHelperText,
  IconButton,
  Divider,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import * as yep from "yup";
import { apiRouterCall } from "src/ApiConfig/service";
import toast from "react-hot-toast";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import { BsEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import Profile from "./Profile";
import { AuthContext } from "src/context/Auth";

const formValidationSchema = yep.object().shape({
  oldPassword: yep
    .string()
    .trim()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Enter at least 1 upper case and 1 symbol."
    )
    .required("Old password is required.")
    .min(8, "Please enter atleast 8 characters.")
    .max(16, "You can enter only 16 characters."),
  newPassword: yep
    .string()
    .trim()
    .notOneOf(
      [yep.ref("oldPassword"), null],
      "New password cannot be the same as old password."
    )
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Enter at least 1 upper case and 1 symbol."
    )
    .required("New password is required.")
    .min(8, "Please enter atleast 8 characters.")
    .max(16, "You can enter only 16 characters."),

  reEnterPassword: yep
    .string()
    .required("Re Enter password is required.")
    .oneOf(
      [yep.ref("newPassword"), null],
      "Re-Enter password should match with the new password."
    ),
});

const useStyles = makeStyles((theme) => ({
  changeprofileBox: {
    position: "relative",
    zIndex: "999",
    "& .displaySpacebetween": {
      paddingBottom: "20px",
    },

    "& p": {
      textAlign: "left",
    },
  },
}));

export default function ChangeProfile(userData) {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPass, setShowPassword] = useState({
    oldPass: false,
    newPass: false,
  });

  const formInitialSchema = {
    oldPassword: "",
    newPassword: "",
    reEnterPassword: "",
  };

  const handleSubmit = async (values) => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: "PATCH",
        endPoint: "changePassword",
        bodyData: {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          confirmPassword: values.reEnterPassword,
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        auth.handleLogout();
        history.replace("/login");
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      console.log(error);
      setIsUpdating(false);
    }
  };

  return (
    <Box className={classes.changeprofileBox}>
      {/* <Grid container spacing={2}>
        <Grid item xs={12} md={6} align="left"> */}

      <Box mb={3}>
        <Typography variant="h3" color="primary">
          Change Password
        </Typography>

        <Divider className="borderBox" />
      </Box>
      <Box>
        <Formik
          initialValues={formInitialSchema}
          validationSchema={formValidationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            setFieldValue,
          }) => (
            <Form>
              <Paper elevation={2}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <Box mt={2} mb={1}>
                      <Typography variant="body2" color="primary">
                        Old Password <span style={{ color: "#EB5A2C" }}>*</span>
                      </Typography>
                    </Box>
                    <TextField
                      type={showPass?.oldPass ? "text" : "password"}
                      variant="outlined"
                      placeholder="Enter old password"
                      fullWidth
                      name="oldPassword"
                      value={values.oldPassword}
                      error={Boolean(
                        touched?.oldPassword && errors?.oldPassword
                      )}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      disabled={isUpdating}
                      InputProps={{
                        autoComplete: "off",
                        endAdornment: (
                          <IconButton
                            onClick={() =>
                              setShowPassword({
                                ...showPass,
                                ["oldPass"]: !showPass?.oldPass,
                              })
                            }
                          >
                            {showPass?.oldPass ? (
                              <BsEyeFill style={{ color: "9e9d9d" }} />
                            ) : (
                              <BsFillEyeSlashFill style={{ color: "9e9d9d" }} />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                    <FormHelperText error>
                      {touched?.oldPassword && errors?.oldPassword}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Box>
                      <Box mt={2} mb={1}>
                        <Typography variant="body2" color="primary">
                          New Password{" "}
                          <span style={{ color: "#EB5A2C" }}>*</span>
                        </Typography>
                      </Box>
                      <TextField
                        type={showPass?.newPass ? "text" : "password"}
                        variant="outlined"
                        placeholder="Enter new password"
                        fullWidth
                        name="newPassword"
                        value={values.newPassword}
                        error={Boolean(
                          touched?.newPassword && errors?.newPassword
                        )}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isUpdating}
                        InputProps={{
                          autoComplete: "off",
                          endAdornment: (
                            <IconButton
                              onClick={() =>
                                setShowPassword({
                                  ...showPass,
                                  ["newPass"]: !showPass?.newPass,
                                })
                              }
                            >
                              {showPass?.newPass ? (
                                <BsEyeFill style={{ color: "9e9d9d" }} />
                              ) : (
                                <BsFillEyeSlashFill
                                  style={{ color: "9e9d9d" }}
                                />
                              )}
                            </IconButton>
                          ),
                        }}
                      />
                      <FormHelperText error>
                        {touched?.newPassword && errors?.newPassword}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Box>
                      <Box mt={2} mb={1}>
                        <Typography variant="body2" color="primary">
                          Confirm Password{" "}
                          <span style={{ color: "#EB5A2C" }}>*</span>
                        </Typography>
                      </Box>

                      <TextField
                        type="password"
                        variant="outlined"
                        placeholder="Enter confirm password"
                        fullWidth
                        name="reEnterPassword"
                        value={values.reEnterPassword}
                        error={Boolean(
                          touched?.reEnterPassword && errors?.reEnterPassword
                        )}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isUpdating}
                        onPaste={(e) => e.preventDefault()}
                      />
                      <FormHelperText error>
                        {touched?.reEnterPassword && errors?.reEnterPassword}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Box className="displayStart" mt={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ minWidth: "186px" }}
                        disabled={isUpdating}
                      >
                        Submit
                        {isUpdating && <ButtonCircularProgress />}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Form>
          )}
        </Formik>
      </Box>
      {/* </Grid> */}
      {/* <Grid item xs={12} md={6}>
          <Profile />
        </Grid> */}
      {/* // </Grid> */}
    </Box>
  );
}
