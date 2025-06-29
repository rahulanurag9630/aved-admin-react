import {
    Avatar,
    Box,
    Grid,
    makeStyles,
    Typography,
    TextField,
    Button,
    Paper,
    FormHelperText,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { FiUpload } from "react-icons/fi";
import uploadFile, { getBase64 } from "src/utils";
import { apiRouterCall } from "../../../ApiConfig/service";
import toast from "react-hot-toast";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    formWrapper: {
        padding: theme.spacing(4),
    },
    imageUploadBox: {
        border: "2px dashed #000000",
        padding: theme.spacing(2),
        borderRadius: "10px",
        textAlign: "center",
    },
    previewImage: {
        height: "120px",
        width: "120px",
        borderRadius: "10px",
        marginTop: theme.spacing(2),
    },
}));

const validationSchema = yup.object().shape({
    title: yup.string().required("Please enter title.").min(3, "Enter at least 3 characters"),
    title_ar: yup.string().required("الرجاء إدخال العنوان").min(3, "أدخل 3 أحرف على الأقل"),
    image: yup.string().required("Image is required"),
});

const AddAmenities = () => {
    const classes = useStyles();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const location = useLocation();

    const isEditMode = location?.state?.editAmenities || false;
    const editData = location?.state || {};

    const initialValues = {
        ...(editData?._id ? { id: editData._id } : {}), // Conditional spread
        title: editData?.title || "",
        title_ar: editData?.title_ar || "",
        image: editData?.image || "",
    };

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        console.log("Form data:", values);

        try {
            setLoading(true);

            const res = await apiRouterCall({
                method: "POST",
                endPoint: "addUpdateAmenities",
                bodyData: values,
                token: localStorage.getItem("token"),
            });

            if (res?.data?.responseCode === 200) {
                toast.success(res?.data?.responseMessage || "Amenities updated successfully!");
                history.push("/amenities-management");
            } else {
                toast.error(res?.data?.responseMessage || "Error while uploading file");
            }
        } catch (error) {
            console.log("❌ Error in submit --->>", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={2} className={classes.formWrapper}>
            <Typography variant="h6" color="secondary" gutterBottom>
                {isEditMode ? "Edit Amenity" : "Add New Amenity"}
            </Typography>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
                    <Form>
                        <Grid container spacing={3}>
                            <Grid container spacing={2} style={{ marginTop: "10px" }}>
                                {/* Title */}
                                <Grid item xs={6}>
                                    <Typography
                                        variant="body2"
                                        color="secondary"
                                        style={{ marginBottom: "5px" }}
                                    >
                                        Title
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter title"
                                        name="title"
                                        variant="outlined"
                                        value={values.title}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.title && errors.title)}
                                    />
                                    <FormHelperText error>{touched.title && errors.title}</FormHelperText>
                                </Grid>

                                {/* Title_ar */}
                                <Grid item xs={6}>
                                    <Typography
                                        variant="body2"
                                        color="secondary"
                                        dir="rtl"
                                        style={{ marginBottom: "5px" }}
                                    >
                                        العنوان
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="أدخل العنوان"
                                        dir="rtl"
                                        name="title_ar"
                                        variant="outlined"
                                        value={values.title_ar}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.title_ar && errors.title_ar)}
                                    />
                                    <FormHelperText error>
                                        {touched.title_ar && errors.title_ar}
                                    </FormHelperText>
                                </Grid>
                            </Grid>

                            {/* Image Upload */}
                            <Grid item xs={6}>
                                <Typography
                                    variant="body2"
                                    color="secondary"
                                    style={{ marginBottom: "5px" }}
                                >
                                    Image
                                </Typography>
                                <Box className={classes.imageUploadBox}>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const url = await uploadFile(file, setLoading);
                                                getBase64(file, (result) => {
                                                    setFieldValue("image", url);
                                                });
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="displayCenter"
                                        style={{ flexDirection: "column" }}
                                    >
                                        <Avatar>
                                            <FiUpload color="#fff" />
                                        </Avatar>
                                        <Typography
                                            variant="body2"
                                            style={{
                                                marginTop: 8,
                                                textAlign: "center",
                                                color: "#fff",
                                            }}
                                        >
                                            Click to upload image
                                        </Typography>
                                    </label>

                                    {values.image && (
                                        <img
                                            src={values.image}
                                            alt="Preview"
                                            className={classes.previewImage}
                                        />
                                    )}

                                    <FormHelperText error>
                                        {touched.image && errors.image}
                                    </FormHelperText>
                                </Box>
                            </Grid>

                            {/* Buttons */}
                            <Grid item xs={12} className="displayCenter">
                                <div style={{ display: "flex", gap: "25px", marginTop: "25px" }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => window.history.back()}
                                    >
                                        Back
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? isEditMode
                                                ? "Updating..."
                                                : "Submitting..."
                                            : isEditMode
                                                ? "Update"
                                                : "Submit"}
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default AddAmenities;
