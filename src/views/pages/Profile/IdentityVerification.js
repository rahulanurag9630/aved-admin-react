import {
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
import ButtonCircularProgress from "../../../component/ButtonCircularProgress";
import { apiRouterCall } from "src/ApiConfig/service";
import toast from "react-hot-toast";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { MdVerified } from "react-icons/md";

const IdentityVerification = ({ userData }) => {
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
                    Identity Verification 
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
                                    <Grid item xs={12} sm={8} md={6}>
                                        <Box mb={1}>
                                            <Typography color="secondary" variant="subtitle1">
                                            Email Verified


                                            </Typography>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            //   placeholder="First name"
                                            disabled
                                            value={"Yes"}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8} md={6}>
                                        <Box mb={1}>
                                            <Typography color="secondary" variant="subtitle1">
                                            Phone Verified


                                            </Typography>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            //   placeholder="Last name"
                                            disabled
                                            value={"Yes"}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8} md={6}>
                                        <Box mb={1}>
                                            <Typography color="secondary" variant="subtitle1">
                                            Face Scan Completed


                                            </Typography>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={"Yes"}
                                            name="email"
                                            type="email"
                                            error={Boolean(touched.email && errors.email)}
                                            onBlur={handleBlur}
                                            disabled

                                        />

                                    </Grid>
                                    <Grid item xs={12} sm={8} md={6}>
                                        <Box mb={1}>
                                            <Typography color="secondary" variant="subtitle1">
                                            Fingerprint Auth


                                            </Typography>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            disabled
                                            value={"Yes"}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8} md={6}>
                                        <Box mb={1}>
                                            <Typography color="secondary" variant="subtitle1">
                                            Guardian Info Verified


                                            </Typography>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            disabled
                                            value={"Yes"}
                                        />
                                    </Grid>
                              
                                </Grid>

                            </Form>
                        )}
                    </Formik>
                </Box>
            </Paper>

        </>
    );
};

export default IdentityVerification;
