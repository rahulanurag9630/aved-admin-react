import {
  Avatar,
  Box,
  Grid,
  makeStyles,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Container,
  IconButton,
} from "@material-ui/core";
import { BiLock } from "react-icons/bi";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { FiEdit, FiPaperclip } from "react-icons/fi";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { MenuProps, getBase64 } from "src/utils";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { apiRouterCall } from "src/ApiConfig/service";
import toast from "react-hot-toast";
import moment from "moment";
import PhoneInput from "react-phone-input-2";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import "react-phone-input-2/lib/style.css";
import { AuthContext } from "src/context/Auth";
import { MdDelete } from "react-icons/md";
import { FiUpload } from "react-icons/fi";

const useStyles = makeStyles((theme) => ({
  profileBox: {
    position: "relative",
    zIndex: "999",
    marginBottom: "118px",
    "& .displaySpacebetween": {
      paddingBottom: "20px",
    },

    "& .formBox": {
      // maxWidth: "650px",
      // [theme.breakpoints.down("xs")]: {
      //   maxWidth: "100%",
      // },
    },
    "& p": {
      fontSize: "14px",
    },
    "& .order1": {
      order: "1",
      [theme.breakpoints.down("sm")]: {
        order: "2",
      },
    },
    "& .order2": {
      order: "1",
      [theme.breakpoints.down("sm")]: {
        order: "1",
      },
    },
  },
  profileDesign: {
    border: "2px dashed #FFFFFF26",
    width: "220px",
    display: "flex",
    height: "215px",
    padding: "10px",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#746058",
    borderRadius: "10px",
  },
  imgsection: {
    height: "120px",
    width: "120px",
    borderRadius: "100px",
    marginTop: "40px",
  },
  upload: {
    top: "-41px",
    // right: "-46px",
    cursor: "pointer",
    position: "relative",
    borderRadius: "50px",
    "& .editicon": {
      marginTop: "24px",
      "& svg": {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: "27px",
      },
    },
    "& .MuiAvatar-root": {
      background: "transparent",
      cursor: "pointer",
    },
  },
  Cards: {
    position: "relative",
    marginTop: "8px !important",
    "& .MuiIconButton-root": {
      background:
        "linear-gradient(93.34deg, #FF6F37 6.82%, #FF2676 35.9%, #B801AA 68.08%, #7101BC 101.4%)",

      position: "absolute",
      bottom: "5px",
      right: "5px",
    },
    "&  .MuiAvatar-root": {
      marginTop: "15px",
      cursor: "pointer",
      height: "215px",
      display: "flex",
      background: "#2f2e2e",
      alignItems: "center",
      borderRadius: "10px",
      justifyContent: "center",
      width: "100%",
    },
  },
  BoxImg: {
    marginTop: "24px",
    border: "2px dashed rgba(255, 255, 255, 0.15)",
    cursor: "pointer",
    height: "215px",
    display: "flex",
    background: "#EAECF0",
    alignItems: "center",
    borderRadius: "10px",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    maxWidth: "100%",
    "& p": {
      paddingTop: "10px",
    },
    "& h6": {
      color: "#000",
    },
  },
}));

export default function Profile(userData) {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const initialFormValues = {
    name: auth?.userData?.name || "",
    email: auth?.userData?.email || "",
    profilePic: auth?.userData?.profilePic || "",
  };

  const validationFormSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, "Please enter atleast 3 characters.")
      .max(32, "You can enter only 32 characters.")
      .required("Name is required.")
      .matches(
        /^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$/g,
        "Please enter name."
      ),
    email: yup
      .string()
      .trim()
      .email("Please enter valid email.")
      .required("Email is required.")
      .max(100, "Should not exceeds 100 characters.")
      .matches("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"),
  });

  const handleAddGarageApi = async (values) => {
    try {
      setIsLoading(true);
      const response = await apiRouterCall({
        method: "PUT",
        endPoint: "editProfile",
        bodyData: {
          name: values.name,
          email: values.email.toLowerCase(),
          profilePic: values.profilePic,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        auth.getProfileDataHandler();
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Box className={classes.profileBox}>
      <Formik
        enableReinitialize
        initialValues={initialFormValues}
        validationSchema={validationFormSchema}
        onSubmit={(values) => handleAddGarageApi(values)}
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} className="order1">
                <Paper elevation={2}>
                  <Typography variant="h3" color="primary">
                    Edit Profile
                  </Typography>
                  <Box className="formBox">
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="body1" color="primary">
                          Add Profile Image
                          <span style={{ color: "#EB5A2C" }}>*</span>
                        </Typography>

                        <Typography
                          variant="body2"
                          color="secondary"
                          style={{ color: "#071c35" }}
                        >
                          Profile picture should be at least 800x800 pixels.
                        </Typography>
                        <Box className={classes.profileDesign} mt={3}>
                          <Box>
                            <Box className={classes.profile}>
                              <figure className="figure">
                                <Avatar
                                  className={classes.imgsection}
                                  src={
                                    values.profilePic
                                      ? values.profilePic
                                      : "images/profile.png"
                                  }
                                />
                              </figure>
                            </Box>

                            <>
                              <input
                                style={{ display: "none" }}
                                id="raised-button-file"
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                disabled={isLoading}
                                onChange={(e) => {
                                  getBase64(e.target.files[0], (result) => {
                                    setFieldValue("profilePic", result);
                                  });
                                }}
                              />
                              <Box display="flex" justifyContent="center">
                                <Box className={classes.upload}>
                                  <Box className="iconimg" align="center">
                                    <label htmlFor="raised-button-file">
                                      <Avatar className="editicon">
                                        <FiUpload
                                          style={{
                                            color: "#071c35",
                                            fontSize: "27px",
                                          }}
                                        />
                                      </Avatar>
                                      <Box
                                        align="center"
                                        style={{ cursor: "pointer" }}
                                      >
                                        <Typography
                                          variant="body2"
                                          color="secondary"
                                          mt={3}
                                          style={{
                                            textAlign: "center",
                                            color: "#071c35",
                                          }}
                                        >
                                          Browse Files
                                        </Typography>
                                      </Box>
                                    </label>
                                  </Box>
                                </Box>
                              </Box>
                            </>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box mt={2} mb={1}>
                          <Typography variant="body2" color="primary">
                            Full Name{" "}
                            <span style={{ color: "#EB5A2C" }}>*</span>
                          </Typography>
                        </Box>
                        <TextField
                          variant="outlined"
                          placeholder="Please enter name"
                          fullWidth
                          required
                          name="name"
                          value={values.name}
                          error={Boolean(touched?.name && errors?.name)}
                          onBlur={handleBlur}
                          onChange={(e) =>
                            e.target.value.length <= 33 && handleChange(e)
                          }
                          disabled={isLoading}
                        />
                        <FormHelperText error>
                          {touched?.name && errors?.name}
                        </FormHelperText>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Box mt={2} mb={1}>
                            <Typography variant="body2" color="primary">
                              Email Address{" "}
                              <span style={{ color: "#EB5A2C" }}>*</span>
                            </Typography>
                          </Box>

                          <TextField
                            type="email"
                            variant="outlined"
                            placeholder="Please enter email"
                            fullWidth
                            name="email"
                            value={values.email}
                            error={Boolean(touched?.email && errors?.email)}
                            onBlur={handleBlur}
                            onChange={(e) =>
                              e.target.value.length <= 101 && handleChange(e)
                            }
                            disabled={isLoading}
                          />
                          <FormHelperText error>
                            {touched?.email && errors?.email}
                          </FormHelperText>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className="displayCenter" mt={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      style={{ minWidth: "168px" }}
                      disabled={isLoading}
                    >
                      Update Profile {isLoading && <ButtonCircularProgress />}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
