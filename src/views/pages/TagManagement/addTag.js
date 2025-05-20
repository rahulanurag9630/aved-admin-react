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
    MenuItem,
} from "@material-ui/core";
import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { FiUpload } from "react-icons/fi";
import { getBase64 } from "src/utils";

const useStyles = makeStyles((theme) => ({
    formWrapper: {
        padding: theme.spacing(4),
    },
    imageUploadBox: {
        border: "2px dashed #FFFFFF26",
        padding: theme.spacing(2),
        borderRadius: "10px",
        textAlign: "center",
    },
}));

const validationSchema = yup.object().shape({
    title: yup.string().required("Please enter title.").min(3, "Enter at least 3 characters"),
    title_ar: yup
        .string()
        .required("الرجاء إدخال العنوان.")
        .min(3, "أدخل 3 أحرف على الأقل"),
});

const AddTag = () => {
    const classes = useStyles();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues = {
        title: "",
        title_ar: "",
    };

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        console.log("Subscription data submitted:", values);
        // Submit to backend here
        setIsSubmitting(false);
    };

    return (
        <Paper elevation={2} className={classes.formWrapper}>
            <Typography variant="h6" color="secondary" gutterBottom>
                Add New Tag
            </Typography>

            <Formik
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
                                    <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
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

                                {/* Title */}
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="secondary" dir="rtl" style={{ marginBottom: "5px" }}>
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
                                    <FormHelperText error>{touched.title_ar && errors.title_ar}</FormHelperText>
                                </Grid>
                            </Grid>

                            {/* Submit Button */}

                            <Grid item xs={7}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    {/* Back Button */}
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => window.history.back()}
                                    >
                                        Back
                                    </Button>

                                    {/* Submit Button */}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit"}
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

export default AddTag;
