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
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import JoditEditor from "jodit-react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { FiUpload } from "react-icons/fi";
import uploadFile, { getBase64 } from "src/utils";
import toast from "react-hot-toast";
import { apiRouterCall } from "../../../ApiConfig/service";

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    padding: theme.spacing(4),
  },
  imageUploadBox: {
    border: "2px dashed #000",
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
  description: yup.string().required("Please enter description.").min(10, "Enter at least 10 characters"),
  description_ar: yup
    .string()
    .required("يرجى إدخال الوصف.")
    .min(10, "أدخل 10 أحرف على الأقل."),

  image: yup.string().required("Please upload an image."),
  title_ar: yup
    .string()
    .required("يرجى إدخال العنوان.")
    .min(3, "أدخل 3 أحرف على الأقل."),

  image_ar: yup
    .string()
    .required("يرجى تحميل صورة."),


});


const AddBlog = () => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const location = useLocation();
  const editorRefEn = useRef(null);
  const editorRefAr = useRef(null);

  const isEdit = location?.state?.isEdit || false;
  const isView = location?.state?.isView || false;

  const editData = location?.state || {};
  console.log("dsfdfdfdfsdfsdfsdfdsfd", location.state)

  const initialValues = {
    id: editData?._id || "",
    title: editData?.title || "",
    title_ar: editData?.title_ar || "",
    description: editData?.description || "",
    description_ar: editData?.description_ar || "",
    image: editData?.image || "",
    image_ar: editData?.image_ar || "",
  };
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      setLoading(true);

      const bodyData = {
        id: values.id || undefined,
        title: values.title,
        title_ar: values.title_ar,
        description: values.description,
        description_ar: values.description_ar,
        image: values.image,
        image_ar: values.image_ar,
      };

      const res = await apiRouterCall({
        method: "POST",
        endPoint: "addOrUpdateBlog",
        bodyData,
      });

      if (res?.data?.responseCode === 200) {
        toast.success(values.id ? "Blog updated successfully." : "Blog added successfully.");
        window.history.back();
      } else {
        toast.error(res?.data?.responseMessage || "Something went wrong.");
      }
    } catch (err) {
      console.error("Blog add/update error:", err);
      toast.error("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  if (!initialValues) return <Typography>Loading form...</Typography>;

  return (
    <Paper elevation={2} className={classes.formWrapper}>
      <Typography variant="h6" color="secondary" gutterBottom>
        {isEdit ? "Edit Blog" : isView ? "View Blog" : "Add New Blog"}
      </Typography>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Title fields */}
              <Grid container spacing={2} style={{ marginTop: "10px" }}>
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
                    disabled={isView}
                  />
                  <FormHelperText error>{touched.title && errors.title}</FormHelperText>
                </Grid>

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
                    disabled={isView}
                  />
                  <FormHelperText error>{touched.title_ar && errors.title_ar}</FormHelperText>
                </Grid>
              </Grid>

              {/* Description fields */}
              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                    Description
                  </Typography>
                  <JoditEditor
                    ref={editorRefEn}
                    value={values.description}
                    config={{
                      readonly: isView || loading,
                      toolbar: !isView,
                    }}
                    onBlur={(newContent) => setFieldValue("description", newContent)}
                  />
                  <FormHelperText error>{touched.description && errors.description}</FormHelperText>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" dir="rtl" color="secondary" style={{ marginBottom: "5px" }}>
                    الوصف
                  </Typography>
                  <JoditEditor
                    ref={editorRefAr}
                    value={values.description_ar}
                    config={{
                      readonly: isView || loading,
                      toolbar: !isView,
                      direction: "rtl",
                      language: "ar",
                    }}
                    onBlur={(newContent) => setFieldValue("description_ar", newContent)}
                  />
                  <FormHelperText error>{touched.description_arb && errors.description_arb}</FormHelperText>
                </Grid>
              </Grid>

              {/* Image Upload */}
              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                {/* English Image */}
                <Grid item xs={6}>
                  <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                    Image
                  </Typography>
                  <Box className={classes.imageUploadBox}>
                    {!isView && (
                      <>
                        <input
                          id="image-upload-en"
                          type="file"
                          accept="image/*"
                          style={{ display: "none", cursor: "pointer", }}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              try {
                                setLoading(true);
                                const url = await uploadFile(file, setLoading);
                                if (url) setFieldValue("image", url);
                              } catch (err) {
                                toast.error("Image upload failed!");
                              } finally {
                                setLoading(false);
                              }
                            }
                          }}
                        />
                        <label htmlFor="image-upload-en" className="displayCenter" style={{ flexDirection: "column", cursor: isView ? "default" : "pointer" }}>
                          <Avatar><FiUpload color="#FFF" /></Avatar>
                          <Typography variant="body2" style={{ marginTop: 8, textAlign: "center", color: "#fff" }}>
                            Click to upload image
                          </Typography>
                        </label>
                      </>
                    )}
                    {values.image && (
                      <img src={values.image} alt="Preview" className={classes.previewImage} />
                    )}
                    <FormHelperText error>{touched.image && errors.image}</FormHelperText>
                  </Box>
                </Grid>

                {/* Arabic Image */}
                <Grid item xs={6}>
                  <Typography variant="body2" dir="rtl" color="secondary" style={{ marginBottom: "5px" }}>
                    الصورة
                  </Typography>
                  <Box className={classes.imageUploadBox}>
                    {!isView && (
                      <>
                        <input
                          id="image-upload-ar"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              try {
                                setLoading(true);
                                const url = await uploadFile(file, setLoading);
                                if (url) setFieldValue("image_ar", url);
                              } catch (err) {
                                toast.error("Image upload failed!");
                              } finally {
                                setLoading(false);
                              }
                            }
                          }}
                        />
                        <label htmlFor="image-upload-ar" className="displayCenter" style={{ flexDirection: "column", cursor: isView ? "default" : "pointer" }}>
                          <Avatar><FiUpload color="#FFF" /></Avatar>
                          <Typography variant="body2" style={{ marginTop: 8, textAlign: "center", color: "#fff" }}>
                            اضغط لتحميل الصورة
                          </Typography>
                        </label>
                      </>
                    )}
                    {values.image_ar && (
                      <img src={values.image_ar} alt="معاينة" className={classes.previewImage} />
                    )}
                    <FormHelperText error>{touched.image_ar && errors.image_ar}</FormHelperText>
                  </Box>
                </Grid>
              </Grid>

              {/* Submit/Back Buttons */}
              <Grid item xs={7} style={{ marginTop: "16px" }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => window.history.back()}
                  >
                    Back
                  </Button>
                  {!isView && (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : isEdit ? "Update" : "Submit"}
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

export default AddBlog;