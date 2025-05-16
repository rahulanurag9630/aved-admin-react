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
    backgroundColor: "#282435",
  },
  previewImage: {
    height: "120px",
    width: "120px",
    borderRadius: "10px",
    marginTop: theme.spacing(2),
  },
}));

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required").min(3, "Enter at least 3 characters"),
  description: yup.string().required("Description is required").min(10, "Enter at least 10 characters"),
  price: yup.number().required("Price is required").min(0, "Invalid price"),
  durationLabel: yup.string().required("Duration label is required"),
  durationValue: yup.number().required("Duration value is required"),
  image: yup.string().required("Image is required"),
  badge: yup.string().required("Badge is required"),
});

const AddSubscriptionForm = () => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    title: "",
    description: "",
    price: "",
    durationLabel: "",
    durationValue: "",
    image: "",
    badge: "",
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
        Add New Subscription
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={7}>
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

              {/* Description */}
              <Grid item xs={7}>
                <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  placeholder="Enter description"
                  name="description"
                  variant="outlined"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.description && errors.description)}
                />
                <FormHelperText error>{touched.description && errors.description}</FormHelperText>
              </Grid>

              {/* Price */}
              <Grid item xs={7}>
                <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                  Price ($)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Enter price"
                  name="price"
                  variant="outlined"
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.price && errors.price)}
                />
                <FormHelperText error>{touched.price && errors.price}</FormHelperText>
              </Grid>

              {/* Duration Label */}
              <Grid item xs={7}>
                <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                  Duration Label
                </Typography>
                <TextField
                  fullWidth
                  select
                  name="durationLabel"
                  variant="outlined"
                  value={values.durationLabel}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.durationLabel && errors.durationLabel)}
                >
                  <MenuItem value="1 Day">1 Day</MenuItem>
                  <MenuItem value="1 Month">1 Month</MenuItem>
                  <MenuItem value="24 Hours">24 Hours</MenuItem>
                </TextField>
                <FormHelperText error>{touched.durationLabel && errors.durationLabel}</FormHelperText>
              </Grid>

              {/* Duration Value */}
              <Grid item xs={7}>
                <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                  Duration Value
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Enter duration in days"
                  name="durationValue"
                  variant="outlined"
                  value={values.durationValue}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.durationValue && errors.durationValue)}
                />
                <FormHelperText error>{touched.durationValue && errors.durationValue}</FormHelperText>
              </Grid>

              {/* Badge */}
              <Grid item xs={7}>
                <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                  Badge (e.g., Save 60%)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter badge text"
                  name="badge"
                  variant="outlined"
                  value={values.badge}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.badge && errors.badge)}
                />
                <FormHelperText error>{touched.badge && errors.badge}</FormHelperText>
              </Grid>

              {/* Image Upload */}
              <Grid item xs={7}>
                <Box className={classes.imageUploadBox}>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        getBase64(file, (result) => {
                          setFieldValue("image", result);
                        });
                      }
                    }}
                  />
                  <label htmlFor="image-upload" className="displayCenter" style={{ flexDirection: "column" }}>
                    <Avatar>
                      <FiUpload />
                    </Avatar>
                    <Typography variant="body2" style={{ marginTop: 8, textAlign: "center", color: "#071c35" }}>
                      Click to upload image
                    </Typography>
                  </label>

                  {values.image && (
                    <img src={values.image} alt="Preview" className={classes.previewImage} />
                  )}

                  <FormHelperText error>{touched.image && errors.image}</FormHelperText>
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={7} className="displayCenter">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                  style={{ marginTop: "20px" }}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default AddSubscriptionForm;
