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
import React, { useState } from "react";
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
    name: yup.string().required("Please enter name.").min(3, "Enter at least 3 characters"),
    position: yup.string().required("Please enter position.").min(3, "Enter at least 3 characters"),
    thoughts: yup.string().required("Please enter thoughts.").min(3, "Enter at least 3 characters"),
    image: yup.string().required("Please select image."),
    facebook: yup.string().url("Enter a valid URL").nullable(),
    instagram: yup.string().url("Enter a valid URL").nullable(),
    linkedin: yup.string().url("Enter a valid URL").nullable(),
});

const AddTeam = () => {
    const classes = useStyles();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const location = useLocation();

    const isEdit = location?.state?.isEdit || false;
    const isView = location?.state?.isView || false;

    const editData = location?.state || {};

    const initialValues = {
        id: editData?._id || "",
        name: editData?.name || "",
        position: editData?.position || "",
        thoughts: editData?.thoughts || "",
        image: editData?.image || "",
        facebook: editData?.facebook || "",
        instagram: editData?.instagram || "",
        linkedin: editData?.linkedin || "",
    };

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            setLoading(true);
            const res = await apiRouterCall({
                method: "POST",
                endPoint: "addOrUpdateTeam",
                bodyData: values,
                token: localStorage.getItem("token"),
            });

            if (res?.data?.responseCode === 200) {
                toast.success(res?.data?.responseMessage || "Team member updated successfully!");
                window.history.back();
            } else {
                toast.error(res?.data?.responseMessage || "Error while submitting the form");
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
                {isEdit ? "Edit Team" : isView ? "View Team" : "Add New Team"}
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
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                                        Name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter name"
                                        name="name"
                                        variant="outlined"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.name && errors.name)}
                                        disabled={isView}
                                    />
                                    <FormHelperText error>{touched.name && errors.name}</FormHelperText>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                                        Position
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter position"
                                        name="position"
                                        variant="outlined"
                                        value={values.position}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.position && errors.position)}
                                        disabled={isView}
                                    />
                                    <FormHelperText error>{touched.position && errors.position}</FormHelperText>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                                        Thoughts
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter thoughts"
                                        name="thoughts"
                                        variant="outlined"
                                        value={values.thoughts}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.thoughts && errors.thoughts)}
                                        disabled={isView}
                                    />
                                    <FormHelperText error>{touched.thoughts && errors.thoughts}</FormHelperText>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="h6" color="secondary" gutterBottom>
                                        Social Links
                                    </Typography>
                                </Grid>
                                {/* Social Media Fields */}
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                                        Facebook Link
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="https://facebook.com/username"
                                        name="facebook"
                                        variant="outlined"
                                        value={values.facebook}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.facebook && errors.facebook)}
                                        disabled={isView}
                                    />
                                    <FormHelperText error>{touched.facebook && errors.facebook}</FormHelperText>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                                        Instagram Link
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="https://instagram.com/username"
                                        name="instagram"
                                        variant="outlined"
                                        value={values.instagram}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.instagram && errors.instagram)}
                                        disabled={isView}
                                    />
                                    <FormHelperText error>{touched.instagram && errors.instagram}</FormHelperText>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                                        LinkedIn Link
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="https://linkedin.com/in/username"
                                        name="linkedin"
                                        variant="outlined"
                                        value={values.linkedin}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.linkedin && errors.linkedin)}
                                        disabled={isView}
                                    />
                                    <FormHelperText error>{touched.linkedin && errors.linkedin}</FormHelperText>
                                </Grid>
                            </Grid>

                            {/* Image Upload */}
                            <Grid item xs={6}>
                                <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                                    Image
                                </Typography>
                                <Box className={classes.imageUploadBox}>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        disabled={isView}
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const url = await uploadFile(file, setLoading);
                                                getBase64(file, () => {
                                                    setFieldValue("image", url);
                                                });
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="displayCenter"
                                        style={{ flexDirection: "column", cursor: isView ? "default" : "pointer" }}
                                    >
                                        <Avatar>
                                            <FiUpload color="#fff" />
                                        </Avatar>
                                        <Typography
                                            variant="body2"
                                            style={{ marginTop: 8, textAlign: "center", color: "#fff" }}
                                        >
                                            {isView ? "Image upload disabled in view mode" : "Click to upload image"}
                                        </Typography>
                                    </label>

                                    {values.image && (
                                        <img src={values.image} alt="Preview" className={classes.previewImage} />
                                    )}
                                    <FormHelperText error>{touched.image && errors.image}</FormHelperText>
                                </Box>
                            </Grid>

                            {/* Buttons */}
                            <Grid item xs={12} className="displayLeft">
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        gap: "25px",
                                        marginTop: "25px",
                                    }}
                                >
                                    <Button variant="contained" color="secondary" onClick={() => window.history.back()}>
                                        Back
                                    </Button>
                                    {!isView && (
                                        <Button variant="contained" color="primary" type="submit" disabled={loading}>
                                            {loading
                                                ? isEdit
                                                    ? "Updating..."
                                                    : "Submitting..."
                                                : isEdit
                                                ? "Update"
                                                : "Submit"}
                                        </Button>
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default AddTeam;
