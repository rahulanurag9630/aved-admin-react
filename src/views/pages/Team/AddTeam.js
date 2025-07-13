import {
    Avatar,
    Box,
    Grid,
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

const validationSchema = yup.object().shape({
    name: yup.string().required("Please enter name.").min(3, "Enter at least 3 characters"),
    name_ar: yup.string().required("Please enter Arabic name.").min(3, "Enter at least 3 characters"),
    position: yup.string().required("Please enter position.").min(3, "Enter at least 3 characters"),
    position_ar: yup.string().required("Please enter Arabic position.").min(3, "Enter at least 3 characters"),
    thoughts: yup.string().required("Please enter thoughts.").min(3, "Enter at least 3 characters"),
    thoughts_ar: yup.string().required("Please enter Arabic thoughts.").min(3, "Enter at least 3 characters"),
    image: yup.string().required("Please select image."),
    facebook: yup.string().url("Enter a valid URL").nullable(),
    instagram: yup.string().url("Enter a valid URL").nullable(),
    linkedin: yup.string().url("Enter a valid URL").nullable(),
});

const AddTeam = () => {
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
        name_ar: editData?.name_ar || "",
        position: editData?.position || "",
        position_ar: editData?.position_ar || "",
        thoughts: editData?.thoughts || "",
        thoughts_ar: editData?.thoughts_ar || "",
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
        <Paper elevation={2} sx={{ padding: 4 }}>
            <Typography variant="h6" color="secondary" gutterBottom>
                {isEdit ? "Edit Team" : isView ? "View Team" : "Add New Team"}
            </Typography>
            <br />
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
                    <Form>
                        <Grid container spacing={3} mt={3}>
                            <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="secondary" sx={{ marginBottom: "5px" }}>
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
                                    <Typography variant="body2" color="secondary" sx={{ marginBottom: "5px" }}>
                                        Arabic Name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="أدخل الاسم بالعربية"
                                        name="name_ar"
                                        variant="outlined"
                                        value={values.name_ar}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.name_ar && errors.name_ar)}
                                        disabled={isView}
                                        inputProps={{ style: { direction: "rtl", textAlign: "right" } }}
                                    />
                                    <FormHelperText error>{touched.name_ar && errors.name_ar}</FormHelperText>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="secondary" sx={{ marginBottom: "5px" }}>
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
                                    <Typography variant="body2" color="secondary" sx={{ marginBottom: "5px" }}>
                                        Arabic Position
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="أدخل المنصب بالعربية"
                                        name="position_ar"
                                        variant="outlined"
                                        value={values.position_ar}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.position_ar && errors.position_ar)}
                                        disabled={isView}
                                        inputProps={{ style: { direction: "rtl", textAlign: "right" } }}
                                    />
                                    <FormHelperText error>{touched.position_ar && errors.position_ar}</FormHelperText>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="secondary" sx={{ marginBottom: "5px" }}>
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

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="secondary" sx={{ marginBottom: "5px" }}>
                                        Arabic Thoughts
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="أدخل الأفكار بالعربية"
                                        name="thoughts_ar"
                                        variant="outlined"
                                        value={values.thoughts_ar}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.thoughts_ar && errors.thoughts_ar)}
                                        disabled={isView}
                                        inputProps={{ style: { direction: "rtl", textAlign: "right" } }}
                                    />
                                    <FormHelperText error>{touched.thoughts_ar && errors.thoughts_ar}</FormHelperText>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="h6" color="secondary" gutterBottom>
                                        Social Links
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="secondary" sx={{ marginBottom: "5px" }}>
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
                                    <Typography variant="body2" color="secondary" sx={{ marginBottom: "5px" }}>
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
                                    <Typography variant="body2" color="secondary" sx={{ marginBottom: "5px" }}>
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

                            <Grid item xs={6}>
                                <Typography variant="body2" color="secondary" sx={{ marginBottom: "5px" }}>
                                    Image
                                </Typography>
                                <Box
                                    sx={{
                                        border: "2px dashed #000000",
                                        padding: 2,
                                        borderRadius: "10px",
                                        textAlign: "center",
                                    }}
                                >
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
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            cursor: isView ? "default" : "pointer",
                                        }}
                                    >
                                        <Avatar>
                                            <FiUpload color="#fff" />
                                        </Avatar>
                                        <Typography
                                            variant="body2"
                                            sx={{ marginTop: 1, textAlign: "center", color: "#fff" }}
                                        >
                                            {isView ? "Image upload disabled in view mode" : "Click to upload image"}
                                        </Typography>
                                    </label>

                                    {values.image && (
                                        <img
                                            src={values.image}
                                            alt="Preview"
                                            style={{
                                                height: "120px",
                                                width: "120px",
                                                borderRadius: "10px",
                                                marginTop: "16px",
                                            }}
                                        />
                                    )}
                                    <FormHelperText error>{touched.image && errors.image}</FormHelperText>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-start" }}>
                                <Box sx={{ display: "flex", gap: "25px", marginTop: "25px" }}>
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
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default AddTeam;