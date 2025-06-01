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
import React, { useState, useRef, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import JoditEditor from "jodit-react";
import { Form, Formik, FastField } from "formik";
import * as yup from "yup";
import { FiUpload } from "react-icons/fi";
import uploadFile from "src/utils"; // Assuming uploadFile is optimized
import toast from "react-hot-toast";
import { apiRouterCall } from "../../../ApiConfig/service";
import { debounce } from "lodash"; // Add lodash for debouncing

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

// Memoized Form Component
const AddBlogForm = React.memo(
  ({ classes, isView, isEdit, isLoading, setIsLoading }) => {
    const location = useLocation();
    const editorRefEn = useRef(null);
    const editorRefAr = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation Schema
    const validationSchema = useMemo(
      () =>
        yup.object().shape({
          title: yup
            .string()
            .required("Please enter title.")
            .min(3, "Enter at least 3 characters"),
          description: yup
            .string()
            .required("Please enter description.")
            .min(10, "Enter at least 10 characters"),
          description_arb: yup
            .string()
            .required("يرجى إدخال الوصف.")
            .min(10, "أدخل 10 أحرف على الأقل."),
          image: yup.string().required("Please upload an image."),
          title_ar: yup
            .string()
            .required("يرجى إدخال العنوان.")
            .min(3, "أدخل 3 أحرف على الأقل."),
          image_ar: yup.string().required("يرجى تحميل صورة."),
        }),
      []
    );

    // Debounced Handlers
    const debounceSetFieldValue = useCallback(
      debounce((field, value, setFieldValue) => {
        setFieldValue(field, value);
      }, 300),
      []
    );

    // JoditEditor Configs
    const editorConfigEn = useMemo(
      () => ({
        readonly: isView || isLoading,
        toolbar: true,
      }),
      [isView, isLoading]
    );

    const editorConfigAr = useMemo(
      () => ({
        readonly: isView || isLoading,
        toolbar: true,
        direction: "rtl",
        language: "ar",
      }),
      [isView, isLoading]
    );

    // Handle Submit
    const handleSubmit = useCallback(
      async (values) => {
        setIsSubmitting(true);
        try {
          setIsLoading(true);
          const bodyData = {
            id: values.id || undefined, // for update
            title: values.title,
            title_ar: values.title_ar,
            description: values.description,
            description_ar: values.description_arb,
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
          } else {
            toast.error(res?.data?.responseMessage || "Something went wrong.");
          }
        } catch (err) {
          console.error("Blog add/update error:", err);
          toast.error("Server error. Please try again.");
        } finally {
          setIsLoading(false);
          setIsSubmitting(false);
        }
      },
      [setIsLoading]
    );

    return (
      <Formik
        initialValues={{
          title: "",
          title_ar: "",
          description: "",
          description_arb: "",
          image: "",
          image_ar: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false} // Disable validation on change
        validateOnBlur={true} // Validate on blur
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
                  <FastField name="title">
                    {({ field, meta }) => (
                      <>
                        <TextField
                          {...field}
                          fullWidth
                          placeholder="Enter title"
                          variant="outlined"
                          disabled={isView || isLoading}
                          error={Boolean(meta.touched && meta.error)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <FormHelperText error>{meta.touched && meta.error}</FormHelperText>
                      </>
                    )}
                  </FastField>
                </Grid>

                {/* Title Arabic */}
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="secondary"
                    dir="rtl"
                    style={{ marginBottom: "5px" }}
                  >
                    العنوان
                  </Typography>
                  <FastField name="title_ar">
                    {({ field, meta }) => (
                      <>
                        <TextField
                          {...field}
                          fullWidth
                          placeholder="أدخل العنوان"
                          dir="rtl"
                          variant="outlined"
                          disabled={isView || isLoading}
                          error={Boolean(meta.touched && meta.error)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          inputProps={{ style: { textAlign: "right" }, dir: "rtl", lang: "ar" }}
                        />
                        <FormHelperText error>{meta.touched && meta.error}</FormHelperText>
                      </>
                    )}
                  </FastField>
                </Grid>
              </Grid>

              {/* Description */}
              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="secondary"
                    style={{ marginBottom: "5px" }}
                  >
                    Description
                  </Typography>
                  <JoditEditor
                    ref={editorRefEn}
                    value={values.description}
                    tabIndex={1}
                    config={editorConfigEn}
                    onChange={(newContent) =>
                      debounceSetFieldValue("description", newContent, setFieldValue)
                    }
                  />
                  <FormHelperText error>{touched.description && errors.description}</FormHelperText>
                </Grid>

                {/* Description Arabic */}
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    dir="rtl"
                    color="secondary"
                    style={{ marginBottom: "5px" }}
                  >
                    الوصف
                  </Typography>
                  <JoditEditor
                    ref={editorRefAr}
                    value={values.description_arb}
                    tabIndex={2}
                    config={editorConfigAr}
                    onChange={(newContent) =>
                      debounceSetFieldValue("description_arb", newContent, setFieldValue)
                    }
                  />
                  <FormHelperText error>
                    {touched.description_arb && errors.description_arb}
                  </FormHelperText>
                </Grid>
              </Grid>

              {/* Image Upload */}
              <Grid container spacing={2} style={{ marginTop: "10px" }}>
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
                      id="image-upload-en"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            setIsLoading(true);
                            const url = await uploadFile(file, setIsLoading);
                            if (url) {
                              setFieldValue("image", url);
                            }
                          } catch (err) {
                            toast.error("Image upload failed!");
                          } finally {
                            setIsLoading(false);
                          }
                        }
                      }}
                    />
                    <label
                      htmlFor="image-upload-en"
                      className="displayCenter"
                      style={{ flexDirection: "column" }}
                    >
                      <Avatar>
                        <FiUpload color="#FFF" />
                      </Avatar>
                      <Typography
                        variant="body2"
                        style={{ marginTop: 8, textAlign: "center", color: "#fff" }}
                      >
                        Click to upload image
                      </Typography>
                    </label>
                    {values.image && (
                      <img src={values.image} alt="Preview" className={classes.previewImage} />
                    )}
                    <FormHelperText error>{touched.image && errors.image}</FormHelperText>
                  </Box>
                </Grid>

                {/* Image Arabic */}
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    dir="rtl"
                    color="secondary"
                    style={{ marginBottom: "5px" }}
                  >
                    الصورة
                  </Typography>
                  <Box className={classes.imageUploadBox}>
                    <input
                      id="image-upload-ar"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            setIsLoading(true);
                            const url = await uploadFile(file, setIsLoading);
                            if (url) {
                              setFieldValue("image_ar", url);
                            }
                          } catch (err) {
                            toast.error("Image upload failed!");
                          } finally {
                            setIsLoading(false);
                          }
                        }
                      }}
                    />
                    <label
                      htmlFor="image-upload-ar"
                      className="displayCenter"
                      style={{ flexDirection: "column" }}
                    >
                      <Avatar>
                        <FiUpload color="#FFF" />
                      </Avatar>
                      <Typography
                        variant="body2"
                        style={{ marginTop: 8, textAlign: "center", color: "#fff" }}
                      >
                        اضغط لتحميل الصورة
                      </Typography>
                    </label>
                    {values.image_ar && (
                      <img src={values.image_ar} alt="معاينة" className={classes.previewImage} />
                    )}
                    <FormHelperText error>{touched.image_ar && errors.image_ar}</FormHelperText>
                  </Box>
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => window.history.back()}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    );
  }
);

const AddBlog = () => {
  const classes = useStyles();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const isView = location?.state?.isView;
  const isEdit = location?.state?.isEdit;

  return (
    <Paper elevation={2} className={classes.formWrapper}>
      <Typography variant="h6" color="secondary" gutterBottom>
        {isEdit ? "Edit Blog" : isView ? "View Blog" : "Add New Blog"}
      </Typography>
      <AddBlogForm
        classes={classes}
        isView={isView}
        isEdit={isEdit}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </Paper>
  );
};

export default AddBlog;